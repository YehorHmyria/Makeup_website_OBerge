const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Vipps Configuration
const VIPPS_CONFIG = {
  merchantSerialNumber: process.env.VIPPS_MSN,
  clientId: process.env.VIPPS_CLIENT_ID,
  clientSecret: process.env.VIPPS_CLIENT_SECRET,
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY,
  baseUrl: process.env.VIPPS_ENV === 'production' 
    ? 'https://api.vipps.no' 
    : 'https://apitest.vipps.no'
};

// Store for access tokens (in production use Redis/Database)
let accessToken = null;
let tokenExpiry = null;

/**
 * Get Vipps Access Token
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${VIPPS_CONFIG.baseUrl}/accesstoken/get`,
      {},
      {
        headers: {
          'client_id': VIPPS_CONFIG.clientId,
          'client_secret': VIPPS_CONFIG.clientSecret,
          'Ocp-Apim-Subscription-Key': VIPPS_CONFIG.subscriptionKey
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer
    
    return accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Vipps');
  }
}

/**
 * Generate unique Order ID
 */
function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `OB${timestamp}${random}`.toUpperCase();
}

/**
 * Initiate Vipps Payment
 */
app.post('/api/vipps/initiate', async (req, res) => {
  try {
    const { amount, certificateType, buyerName, buyerEmail, recipientName, message } = req.body;

    // Validate
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 NOK (1 NOK)' });
    }

    const orderId = generateOrderId();
    const token = await getAccessToken();

    // Construct payment request
    const paymentRequest = {
      merchantInfo: {
        merchantSerialNumber: VIPPS_CONFIG.merchantSerialNumber,
        callbackPrefix: `${process.env.APP_URL}/api/vipps/callback`,
        fallBack: `${process.env.APP_URL}/payment-success?orderId=${orderId}`,
        isApp: false
      },
      transaction: {
        orderId: orderId,
        amount: amount * 100, // Convert to øre
        transactionText: `${certificateType} - Gift Certificate`,
        // This is what shows in Vipps app
      },
      customerInfo: {
        mobileNumber: null // Vipps will ask for it
      }
    };

    // Initiate payment with Vipps
    const response = await axios.post(
      `${VIPPS_CONFIG.baseUrl}/ecomm/v2/payments`,
      paymentRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': VIPPS_CONFIG.subscriptionKey,
          'Content-Type': 'application/json',
          'Merchant-Serial-Number': VIPPS_CONFIG.merchantSerialNumber,
          'Vipps-System-Name': 'OlgaBerge',
          'Vipps-System-Version': '1.0',
          'Vipps-System-Plugin-Name': 'custom-integration',
          'Vipps-System-Plugin-Version': '1.0'
        }
      }
    );

    // Store order details (in production use database)
    // For now, we'll send to FormSubmit
    const orderDetails = {
      orderId,
      amount,
      certificateType,
      buyerName,
      buyerEmail,
      recipientName,
      message,
      status: 'initiated',
      createdAt: new Date().toISOString()
    };

    // Send email notification via FormSubmit
    await sendOrderNotification(orderDetails);

    // Return Vipps URL to frontend
    res.json({
      success: true,
      orderId: orderId,
      vippsUrl: response.data.url // This is the Vipps checkout URL
    });

  } catch (error) {
    console.error('Payment initiation failed:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to initiate payment',
      details: error.response?.data || error.message 
    });
  }
});

/**
 * Vipps Callback Handler
 */
app.post('/api/vipps/callback', async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;
    
    console.log('Vipps callback received:', { orderId, transactionId });

    // Get payment details from Vipps
    const token = await getAccessToken();
    const response = await axios.get(
      `${VIPPS_CONFIG.baseUrl}/ecomm/v2/payments/${orderId}/details`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': VIPPS_CONFIG.subscriptionKey,
          'Merchant-Serial-Number': VIPPS_CONFIG.merchantSerialNumber
        }
      }
    );

    const paymentStatus = response.data.transactionSummary.status;

    if (paymentStatus === 'RESERVED') {
      // Payment is reserved, now capture it
      await capturePayment(orderId, response.data.transactionSummary.capturedAmount);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Callback error:', error.response?.data || error.message);
    res.sendStatus(500);
  }
});

/**
 * Capture Payment
 */
async function capturePayment(orderId, amount) {
  try {
    const token = await getAccessToken();
    
    const captureRequest = {
      merchantInfo: {
        merchantSerialNumber: VIPPS_CONFIG.merchantSerialNumber
      },
      transaction: {
        amount: amount,
        transactionText: 'Gift Certificate Payment'
      }
    };

    await axios.post(
      `${VIPPS_CONFIG.baseUrl}/ecomm/v2/payments/${orderId}/capture`,
      captureRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': VIPPS_CONFIG.subscriptionKey,
          'Content-Type': 'application/json',
          'Merchant-Serial-Number': VIPPS_CONFIG.merchantSerialNumber,
          'X-Request-Id': Date.now().toString()
        }
      }
    );

    console.log(`Payment captured for order ${orderId}`);
    
    // Send success email
    await sendPaymentSuccessEmail(orderId);
    
  } catch (error) {
    console.error('Capture failed:', error.response?.data || error.message);
  }
}

/**
 * Check Payment Status
 */
app.get('/api/vipps/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const token = await getAccessToken();

    const response = await axios.get(
      `${VIPPS_CONFIG.baseUrl}/ecomm/v2/payments/${orderId}/details`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': VIPPS_CONFIG.subscriptionKey,
          'Merchant-Serial-Number': VIPPS_CONFIG.merchantSerialNumber
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Send order notification via FormSubmit
 */
async function sendOrderNotification(orderDetails) {
  try {
    const formData = new URLSearchParams();
    formData.append('_subject', `New Order - ${orderDetails.orderId}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('order_id', orderDetails.orderId);
    formData.append('amount', `${orderDetails.amount} NOK`);
    formData.append('certificate_type', orderDetails.certificateType);
    formData.append('buyer_name', orderDetails.buyerName);
    formData.append('buyer_email', orderDetails.buyerEmail);
    formData.append('recipient_name', orderDetails.recipientName);
    formData.append('message', orderDetails.message || 'N/A');
    formData.append('status', 'Payment Initiated');

    await axios.post('https://formsubmit.co/hmyriayehor@gmail.com', formData);
  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
}

/**
 * Send payment success email
 */
async function sendPaymentSuccessEmail(orderId) {
  try {
    const formData = new URLSearchParams();
    formData.append('_subject', `Payment Successful - ${orderId}`);
    formData.append('_captcha', 'false');
    formData.append('order_id', orderId);
    formData.append('status', 'PAID - Please send gift certificate');

    await axios.post('https://formsubmit.co/hmyriayehor@gmail.com', formData);
  } catch (error) {
    console.error('Failed to send success email:', error.message);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vipps payment server running on port ${PORT}`);
  console.log(`Environment: ${process.env.VIPPS_ENV || 'test'}`);
});

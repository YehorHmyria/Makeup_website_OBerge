/**
 * Vipps Payment Integration - API Version
 * Opens official Vipps checkout page
 */

class VippsPayment {
  constructor() {
    // Backend API URL (change for production)
    this.apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api/vipps'
      : 'https://olgaberge.up.railway.app/api/vipps';
    
    this.merchantName = 'Olga Berge';
    this.init();
  }
  
  init() {
    this.attachVippsHandlers();
  }
  
  /**
   * Attach Vipps payment handlers to forms
   */
  attachVippsHandlers() {
    const forms = document.querySelectorAll('.gift-form');
    
    forms.forEach(form => {
      this.addVippsButton(form);
    });
  }
  
  /**
   * Add Vipps payment button to form
   */
  addVippsButton(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    // Create Vipps button
    const vippsBtn = document.createElement('button');
    vippsBtn.type = 'button';
    vippsBtn.className = 'btn btn-vipps btn-large';
    vippsBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
      <span data-i18n="payment.vipps">Pay with Vipps</span>
    `;
    
    vippsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleVippsPayment(form, vippsBtn);
    });
    
    // Insert before submit button
    submitBtn.parentNode.insertBefore(vippsBtn, submitBtn);
    
    // Change submit button text
    submitBtn.textContent = 'Email Order (No Payment)';
    submitBtn.style.marginTop = '10px';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-secondary');
  }
  
  /**
   * Handle Vipps payment process
   */
  async handleVippsPayment(form, button) {
    // Validate form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Disable button
    button.disabled = true;
    button.innerHTML = `
      <div style="width: 20px; height: 20px; border: 3px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <span style="margin-left: 8px;">Processing...</span>
    `;
    
    try {
      // Get form data
      const formData = new FormData(form);
      const paymentData = this.extractPaymentData(formData);
      
      // Validate amount
      if (!paymentData.amount || paymentData.amount < 1) {
        throw new Error('Please enter a valid amount');
      }
      
      // Call backend to initiate payment
      const response = await fetch(`${this.apiUrl}/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initiate payment');
      }
      
      const data = await response.json();
      
      // Redirect to Vipps checkout
      if (data.vippsUrl) {
        // Store order ID for success page
        sessionStorage.setItem('vipps_order_id', data.orderId);
        
        // Redirect to Vipps
        window.location.href = data.vippsUrl;
      } else {
        throw new Error('No payment URL received');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}\n\nPlease try again or use the email order button.`);
      
      // Re-enable button
      button.disabled = false;
      button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        <span>Pay with Vipps</span>
      `;
    }
  }
  
  /**
   * Extract payment data from form
   */
  extractPaymentData(formData) {
    // Get amount - either from input or hidden field
    let amount = formData.get('amount');
    
    if (!amount) {
      const certificateType = formData.get('certificate_type');
      if (certificateType === 'Evening Makeup') amount = 1500;
      else if (certificateType === 'Makeup Course') amount = 3000;
    }
    
    return {
      amount: parseInt(amount),
      certificateType: formData.get('certificate_type') || 'Custom',
      buyerName: formData.get('buyer_name'),
      buyerEmail: formData.get('buyer_email'),
      recipientName: formData.get('recipient_name'),
      message: formData.get('message') || ''
    };
  }
}

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VippsPayment();
});

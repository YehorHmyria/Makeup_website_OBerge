// Form Validation and Submission Handling

class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('form[data-validate]');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.parentElement.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    });
  }

  validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');
    
    if (!formGroup) return true;
    
    // Clear previous error
    formGroup.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
    
    // Required validation
    if (field.hasAttribute('required') && !field.value.trim()) {
      this.showError(formGroup, errorElement, window.languageManager?.t('form.required') || 'This field is required');
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        this.showError(formGroup, errorElement, window.languageManager?.t('form.invalidEmail') || 'Invalid email address');
        return false;
      }
    }
    
    // Norwegian phone validation
    if (field.type === 'tel' && field.value) {
      // Norwegian phone format: +47 followed by 8 digits, or just 8 digits
      const phoneRegex = /^(\+47)?[0-9]{8}$/;
      const cleanPhone = field.value.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        this.showError(formGroup, errorElement, window.languageManager?.t('form.invalidPhone') || 'Invalid phone number');
        return false;
      }
    }
    
    return true;
  }

  showError(formGroup, errorElement, message) {
    formGroup.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!this.validateForm(form)) {
      return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    try {
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = window.languageManager?.t('form.submitting') || 'Submitting...';
      }
      
      // Simulate form submission (replace with actual API call)
      console.log('Form submitted:', data);
      await this.submitForm(form, data);
      
      // Success
      this.showSuccessMessage(form);
      form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(form);
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  }

  async submitForm(form, data) {
    // TODO: Replace with actual backend API endpoint
    // Example: await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data to be sent to backend:', data);
        resolve();
      }, 1000);
    });
  }

  showSuccessMessage(form) {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = window.languageManager?.t('form.success') || 'Success!';
    message.style.cssText = `
      padding: 1rem;
      background: #4caf50;
      color: white;
      border-radius: 8px;
      margin-top: 1rem;
      animation: fadeIn 0.3s ease;
    `;
    
    form.appendChild(message);
    
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  showErrorMessage(form) {
    const message = document.createElement('div');
    message.className = 'form-message error';
    message.textContent = window.languageManager?.t('form.error') || 'Something went wrong';
    message.style.cssText = `
      padding: 1rem;
      background: #f44336;
      color: white;
      border-radius: 8px;
      margin-top: 1rem;
      animation: fadeIn 0.3s ease;
    `;
    
    form.appendChild(message);
    
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }
}

// Initialize form validator when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
  });
} else {
  new FormValidator();
}

/**
 * GlobalReach Web Presence & Growth Portal
 * Form Validation & Input Sanitization Engine
 * File: js/validation.js
 */

const FormValidator = (() => {
  // Regex patterns per specifications
  const PATTERNS = {
    fullName: /^[a-zA-Z\s]{2,50}$/,
    empId: /^[A-Z0-9]{6,12}$/i,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    mobile: /^[6-9]\d{9}$/,
    // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char from @$!%*?&
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  const ERROR_MESSAGES = {
    fullName: 'Name must be 2 to 50 alphabetic characters only.',
    empId: 'ID must be 6 to 12 alphanumeric characters (e.g. GR2026EXP).',
    email: 'Please provide a valid email address (e.g. client@example.com).',
    mobile: 'Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.',
    dept: 'Please choose your division / business category.',
    password: 'Password must have at least 8 characters including uppercase, lowercase, number, and a symbol (@$!%*?&).',
    confirmPassword: 'Passwords do not match.',
    terms: 'You must agree to the Terms of Service and Privacy Policy to continue.',
    message: 'Please provide a message with at least 10 characters.',
    businessType: 'Please select your business type.',
    serviceInterest: 'Please select a service of interest.'
  };

  /**
   * Sanitizes string against XSS injection
   */
  const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  /**
   * Displays inline error message safely using textContent
   */
  const showFieldError = (field, message) => {
    field.classList.remove('valid');
    field.classList.add('invalid');

    // Find or create .error-msg container
    const parent = field.closest('.form-group') || field.parentElement;
    let errorSpan = parent.querySelector('.error-msg');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-msg';
      errorSpan.setAttribute('role', 'alert');
      parent.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  };

  /**
   * Clears inline error and sets valid state
   */
  const clearFieldError = (field) => {
    field.classList.remove('invalid');
    field.classList.add('valid');
    field.removeAttribute('aria-invalid');

    const parent = field.closest('.form-group') || field.parentElement;
    const errorSpan = parent.querySelector('.error-msg');
    if (errorSpan) {
      errorSpan.remove();
    }
  };

  /**
   * Validates a single input field
   */
  const validateField = (field, form) => {
    const name = field.name || field.id;
    const val = field.value ? field.value.trim() : '';

    // Checkbox validation
    if (field.type === 'checkbox') {
      if (field.required && !field.checked) {
        showFieldError(field, ERROR_MESSAGES.terms);
        return false;
      }
      clearFieldError(field);
      return true;
    }

    // Dropdown / Select
    if (field.tagName === 'SELECT') {
      if (!val || val === '') {
        showFieldError(field, ERROR_MESSAGES[name] || 'Please select an option.');
        return false;
      }
      clearFieldError(field);
      return true;
    }

    // Textarea (e.g. contact message)
    if (field.tagName === 'TEXTAREA') {
      if (field.required && val.length < 10) {
        showFieldError(field, ERROR_MESSAGES.message);
        return false;
      }
      clearFieldError(field);
      return true;
    }

    // Confirm Password
    if (name === 'confirmPassword' || field.id === 'confirmPassword') {
      const pwdField = form ? form.querySelector('#password, [name="password"]') : null;
      if (!pwdField || val !== pwdField.value) {
        showFieldError(field, ERROR_MESSAGES.confirmPassword);
        return false;
      }
      clearFieldError(field);
      return true;
    }

    // Pattern-based validation
    if (name === 'fullName' || field.id === 'fullName') {
      if (!PATTERNS.fullName.test(val)) {
        showFieldError(field, ERROR_MESSAGES.fullName);
        return false;
      }
    } else if (name === 'empId' || field.id === 'empId') {
      if (!PATTERNS.empId.test(val)) {
        showFieldError(field, ERROR_MESSAGES.empId);
        return false;
      }
    } else if (name === 'email' || field.id === 'email' || field.type === 'email') {
      if (!PATTERNS.email.test(val)) {
        showFieldError(field, ERROR_MESSAGES.email);
        return false;
      }
    } else if (name === 'mobile' || field.id === 'mobile' || field.id === 'phone' || name === 'phone') {
      if (!PATTERNS.mobile.test(val)) {
        showFieldError(field, ERROR_MESSAGES.mobile);
        return false;
      }
    } else if (name === 'dept' || field.id === 'dept') {
      if (!val) {
        showFieldError(field, ERROR_MESSAGES.dept);
        return false;
      }
    } else if (name === 'password' || field.id === 'password') {
      if (!PATTERNS.password.test(val)) {
        showFieldError(field, ERROR_MESSAGES.password);
        return false;
      }
    } else if (field.required && !val) {
      showFieldError(field, 'This field is required.');
      return false;
    }

    clearFieldError(field);
    return true;
  };

  /**
   * Checks if an entire form is currently valid and toggles submit button state
   */
  const checkFormValidity = (form, submitBtn) => {
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;

    requiredInputs.forEach((input) => {
      // If any field has invalid class or is empty (for required)
      if (input.type === 'checkbox') {
        if (!input.checked) allValid = false;
      } else if (!input.value.trim() || input.classList.contains('invalid')) {
        allValid = false;
      }
    });

    if (submitBtn) {
      if (allValid) {
        submitBtn.removeAttribute('disabled');
        submitBtn.setAttribute('aria-disabled', 'false');
      } else {
        submitBtn.setAttribute('disabled', 'disabled');
        submitBtn.setAttribute('aria-disabled', 'true');
      }
    }

    return allValid;
  };

  /**
   * Attaches real-time validation to a form
   */
  const bindForm = (form, submitBtn) => {
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');

    // Initially disable submit if required
    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'disabled');
      submitBtn.setAttribute('aria-disabled', 'true');
    }

    inputs.forEach((input) => {
      // Validate on blur
      input.addEventListener('blur', () => {
        validateField(input, form);
        checkFormValidity(form, submitBtn);
      });

      // Re-validate and update submit button on input
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateField(input, form);
        }
        checkFormValidity(form, submitBtn);
      });

      // Select and checkbox change
      if (input.tagName === 'SELECT' || input.type === 'checkbox') {
        input.addEventListener('change', () => {
          validateField(input, form);
          checkFormValidity(form, submitBtn);
        });
      }
    });
  };

  return {
    PATTERNS,
    ERROR_MESSAGES,
    sanitize,
    validateField,
    showFieldError,
    clearFieldError,
    checkFormValidity,
    bindForm
  };
})();

window.FormValidator = FormValidator;

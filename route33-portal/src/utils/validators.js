export const validators = {
  required: (value) => ({
    isValid: Boolean(value && value.toString().trim()),
    message: 'This field is required'
  }),
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: 'Please enter a valid email address'
    };
  },
  
  minLength: (min) => (value) => ({
    isValid: value && value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  
  maxLength: (max) => (value) => ({
    isValid: !value || value.length <= max,
    message: `Must be less than ${max} characters`
  }),
  
  accountNumber: (value) => ({
    isValid: /^\d{5,8}$/.test(value),
    message: 'Account number must be 5-8 digits'
  }),
  
  password: (value) => {
    const hasLength = value && value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    
    return {
      isValid: hasLength && hasUpper && hasLower && hasNumber,
      message: 'Password must be 8+ chars with upper, lower, and number'
    };
  },
  
  number: (value) => ({
    isValid: !isNaN(value) && !isNaN(parseFloat(value)),
    message: 'Please enter a valid number'
  }),
  
  positiveNumber: (value) => {
    const num = parseFloat(value);
    return {
      isValid: !isNaN(num) && num > 0,
      message: 'Must be a positive number'
    };
  },
  
  phone: (value) => {
    // Simple phone validation - adjust regex as needed
    const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)]{10,}$/;
    return {
      isValid: phoneRegex.test(value),
      message: 'Please enter a valid phone number'
    };
  },
  
  // Combine multiple validators
  combine: (...validators) => (value) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, message: '' };
  }
};
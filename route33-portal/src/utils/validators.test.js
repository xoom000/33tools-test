import '@testing-library/jest-dom';
import { validators } from './validators';

describe('Validators', () => {
  describe('required validator', () => {
    test('validates empty values correctly', () => {
      expect(validators.required('').isValid).toBe(false);
      expect(validators.required(null).isValid).toBe(false);
      expect(validators.required(undefined).isValid).toBe(false);
      expect(validators.required('   ').isValid).toBe(false);
    });

    test('validates non-empty values correctly', () => {
      expect(validators.required('valid input').isValid).toBe(true);
      expect(validators.required('0').isValid).toBe(true);
      expect(validators.required('false').isValid).toBe(true);
    });

    test('returns correct error message', () => {
      expect(validators.required('').message).toBe('This field is required');
    });
  });

  describe('email validator', () => {
    test('validates invalid email formats', () => {
      const invalidEmails = ['invalid', 'invalid@', '@invalid.com', 'invalid.com'];
      
      invalidEmails.forEach(email => {
        expect(validators.email(email).isValid).toBe(false);
      });
    });

    test('validates valid email formats', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'test+123@gmail.com'];
      
      validEmails.forEach(email => {
        expect(validators.email(email).isValid).toBe(true);
      });
    });

    test('returns correct error message', () => {
      expect(validators.email('invalid').message).toBe('Please enter a valid email address');
    });
  });

  describe('minLength validator', () => {
    test('creates validator with correct minimum length', () => {
      const validator = validators.minLength(5);
      
      expect(validator('1234').isValid).toBe(false);
      expect(validator('12345').isValid).toBe(true);
      expect(validator('123456').isValid).toBe(true);
    });

    test('returns correct error message', () => {
      const validator = validators.minLength(8);
      expect(validator('short').message).toBe('Must be at least 8 characters');
    });
  });

  describe('maxLength validator', () => {
    test('creates validator with correct maximum length', () => {
      const validator = validators.maxLength(10);
      
      expect(validator('12345678901').isValid).toBe(false);
      expect(validator('1234567890').isValid).toBe(true);
      expect(validator('short').isValid).toBe(true);
    });

    test('handles empty values', () => {
      const validator = validators.maxLength(10);
      expect(validator('').isValid).toBe(true);
      expect(validator(null).isValid).toBe(true);
    });

    test('returns correct error message', () => {
      const validator = validators.maxLength(5);
      expect(validator('toolong').message).toBe('Must be less than 5 characters');
    });
  });

  describe('accountNumber validator', () => {
    test('validates account number format', () => {
      expect(validators.accountNumber('12345').isValid).toBe(true);
      expect(validators.accountNumber('123456').isValid).toBe(true);
      expect(validators.accountNumber('12345678').isValid).toBe(true);
      
      expect(validators.accountNumber('123').isValid).toBe(false);
      expect(validators.accountNumber('123456789').isValid).toBe(false);
      expect(validators.accountNumber('abcde').isValid).toBe(false);
    });

    test('returns correct error message', () => {
      expect(validators.accountNumber('abc').message).toBe('Account number must be 5-8 digits');
    });
  });

  describe('password validator', () => {
    test('validates password requirements', () => {
      expect(validators.password('Password123').isValid).toBe(true);
      expect(validators.password('MyStr0ng').isValid).toBe(true);
      
      expect(validators.password('password').isValid).toBe(false); // No uppercase or number
      expect(validators.password('PASSWORD').isValid).toBe(false); // No lowercase or number
      expect(validators.password('Password').isValid).toBe(false); // No number
      expect(validators.password('Pass123').isValid).toBe(false); // Too short
    });

    test('returns correct error message', () => {
      expect(validators.password('weak').message).toBe('Password must be 8+ chars with upper, lower, and number');
    });
  });

  describe('phone validator', () => {
    test('validates phone number formats', () => {
      expect(validators.phone('5551234567').isValid).toBe(true);
      expect(validators.phone('555-123-4567').isValid).toBe(true);
      expect(validators.phone('(555) 123-4567').isValid).toBe(true);
      expect(validators.phone('+1 555 123 4567').isValid).toBe(true);
      
      expect(validators.phone('123').isValid).toBe(false);
      expect(validators.phone('abc').isValid).toBe(false);
    });

    test('returns correct error message', () => {
      expect(validators.phone('123').message).toBe('Please enter a valid phone number');
    });
  });

  describe('number validator', () => {
    test('validates numeric values', () => {
      expect(validators.number('123').isValid).toBe(true);
      expect(validators.number('123.45').isValid).toBe(true);
      expect(validators.number('-123').isValid).toBe(true);
      expect(validators.number('0').isValid).toBe(true);
      
      expect(validators.number('abc').isValid).toBe(false);
      expect(validators.number('12abc').isValid).toBe(false);
    });

    test('returns correct error message', () => {
      expect(validators.number('abc').message).toBe('Please enter a valid number');
    });
  });

  describe('positiveNumber validator', () => {
    test('validates positive numbers', () => {
      expect(validators.positiveNumber('123').isValid).toBe(true);
      expect(validators.positiveNumber('0.1').isValid).toBe(true);
      
      expect(validators.positiveNumber('0').isValid).toBe(false);
      expect(validators.positiveNumber('-123').isValid).toBe(false);
      expect(validators.positiveNumber('abc').isValid).toBe(false);
    });

    test('returns correct error message', () => {
      expect(validators.positiveNumber('0').message).toBe('Must be a positive number');
    });
  });

  describe('combine validator', () => {
    test('combines multiple validators correctly', () => {
      const combinedValidator = validators.combine(
        validators.required,
        validators.minLength(5)
      );

      // Should fail on required
      expect(combinedValidator('').isValid).toBe(false);
      expect(combinedValidator('').message).toBe('This field is required');
      
      // Should fail on minLength
      expect(combinedValidator('abc').isValid).toBe(false);
      expect(combinedValidator('abc').message).toBe('Must be at least 5 characters');
      
      // Should pass all validations
      expect(combinedValidator('valid input').isValid).toBe(true);
    });

    test('returns first error encountered', () => {
      const combinedValidator = validators.combine(
        validators.required,
        validators.email,
        validators.minLength(20)
      );

      // Should return required error first
      expect(combinedValidator('').message).toBe('This field is required');
      
      // Should return email error before minLength
      expect(combinedValidator('invalid').message).toBe('Please enter a valid email address');
      
      // Should return minLength error for valid but short email
      expect(combinedValidator('a@b.co').message).toBe('Must be at least 20 characters');
    });

    test('passes when all validators succeed', () => {
      const combinedValidator = validators.combine(
        validators.required,
        validators.email
      );

      const result = combinedValidator('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('Edge Cases', () => {
    test('handles null and undefined inputs gracefully', () => {
      expect(() => validators.email(null)).not.toThrow();
      expect(() => validators.email(undefined)).not.toThrow();
      expect(() => validators.minLength(5)(null)).not.toThrow();
    });

    test('handles empty string inputs', () => {
      expect(validators.email('').isValid).toBe(false);
      expect(validators.phone('').isValid).toBe(false);
      expect(validators.number('').isValid).toBe(false);
    });

    test('handles non-string inputs appropriately', () => {
      expect(validators.required(123).isValid).toBe(true);
      expect(validators.required(0).isValid).toBe(false); // 0 is falsy so fails your validator
      expect(validators.required(false).isValid).toBe(false); // false is falsy so fails your validator
    });
  });
});
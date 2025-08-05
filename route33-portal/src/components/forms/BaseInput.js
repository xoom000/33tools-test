import { INPUT_STYLES } from '../../config';
import { cn } from '../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Simple base input with configuration! ⚔️
const BaseInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  className = '',
  ...extraProps
}) => {
  const styles = INPUT_STYLES.base;
  const inputClasses = cn(
    styles.input,
    {
      'border-red-500 focus:ring-red-500': error,
      'border-slate-300 focus:ring-primary-500': !error
    }
  );

  return (
    <div className={cn(styles.container, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.requiredIndicator}>*</span>}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...extraProps}
      />
      
      {error && (
        <p className={styles.error}>{error}</p>
      )}
      
      {helperText && !error && (
        <p className={styles.helper}>{helperText}</p>
      )}
    </div>
  );
};

export default BaseInput;
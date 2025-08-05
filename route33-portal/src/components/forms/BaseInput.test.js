import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseInput from './BaseInput';

describe('BaseInput Component', () => {
  const defaultProps = {
    name: 'test-input',
    placeholder: 'Enter text'
  };

  test('renders input with placeholder', () => {
    render(<BaseInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'test-input');
  });

  test('displays value when provided', () => {
    const mockChange = jest.fn();
    render(<BaseInput {...defaultProps} value="test value" onChange={mockChange} />);
    
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const mockChange = jest.fn();
    render(<BaseInput {...defaultProps} onChange={mockChange} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: 'new value'
      })
    }));
  });

  test('shows error state with error message', () => {
    render(<BaseInput {...defaultProps} error="This field is required" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('border-red-500'); // Assuming error styling
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('renders as disabled when disabled prop is true', () => {
    render(<BaseInput {...defaultProps} disabled />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDisabled();
  });

  test('renders with different input types', () => {
    const { rerender } = render(<BaseInput {...defaultProps} type="password" />);
    let input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<BaseInput {...defaultProps} type="email" />);
    input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<BaseInput {...defaultProps} type="number" />);
    input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('type', 'number');
  });

  test('renders label when provided', () => {
    render(<BaseInput {...defaultProps} label="Test Label" />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('shows required indicator when required', () => {
    render(<BaseInput {...defaultProps} label="Required Field" required />);
    
    // Look for asterisk or required indicator
    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<BaseInput {...defaultProps} className="custom-input" />);
    
    const container = screen.getByPlaceholderText('Enter text').parentElement;
    expect(container).toHaveClass('custom-input');
  });

  test('handles focus and blur events', () => {
    const mockFocus = jest.fn();
    const mockBlur = jest.fn();
    
    render(
      <BaseInput 
        {...defaultProps} 
        onFocus={mockFocus} 
        onBlur={mockBlur} 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    
    fireEvent.focus(input);
    expect(mockFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(mockBlur).toHaveBeenCalledTimes(1);
  });

  test('renders help text when provided', () => {
    render(
      <BaseInput 
        {...defaultProps} 
        helperText="This is helpful information" 
      />
    );
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  test('passes extra props to input element', () => {
    render(<BaseInput {...defaultProps} data-testid="custom-input" />);
    
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });
});
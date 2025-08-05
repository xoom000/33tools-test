import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../constants/ui';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('shows loading state with spinner', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('⏳')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  test('disables when loading is true', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('applies primary variant by default', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-800', 'text-white');
  });

  test('applies secondary variant correctly', () => {
    render(<Button variant={BUTTON_VARIANTS.SECONDARY}>Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-100', 'text-primary-800');
  });

  test('applies danger variant correctly', () => {
    render(<Button variant={BUTTON_VARIANTS.DANGER}>Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent-danger-500', 'text-white');
  });

  test('applies different sizes correctly', () => {
    const { rerender } = render(<Button size={BUTTON_SIZES.SM}>Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size={BUTTON_SIZES.LG}>Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  test('shows icon when provided', () => {
    render(<Button icon="🚀">Launch</Button>);
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });

  test('hides icon when loading', () => {
    render(<Button icon="🚀" loading>Launch</Button>);
    expect(screen.queryByText('🚀')).not.toBeInTheDocument();
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  test('sets tooltip title attribute', () => {
    render(<Button tooltip="Click to submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Click to submit');
  });

  test('defaults to button type', () => {
    render(<Button>Default Type</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('accepts submit type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('does not call onClick when disabled', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick} disabled>Disabled</Button>);
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(mockClick).not.toHaveBeenCalled();
  });

  test('does not call onClick when loading', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick} loading>Loading</Button>);
    
    fireEvent.click(screen.getByText('Loading'));
    expect(mockClick).not.toHaveBeenCalled();
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal Component', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Header>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockClose}>
        <Modal.Header>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Header>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    // Click on the backdrop (the overlay div)
    const backdrop = screen.getByRole('dialog').parentElement.previousSibling;
    fireEvent.click(backdrop);
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    // Click on the modal content, not the backdrop
    const modalContent = screen.getByText('Modal content');
    fireEvent.click(modalContent);
    
    expect(mockClose).not.toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when other keys are pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
    
    expect(mockClose).not.toHaveBeenCalled();
  });

  test('renders without title when not provided', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    // Should not have a heading when no title is provided
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('applies different size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockClose} size="small">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    
    let modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('max-w-xs');

    rerender(
      <Modal isOpen={true} onClose={mockClose} size="large">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    
    modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('max-w-md');
  });

  test('renders with custom className', () => {
    render(
      <Modal isOpen={true} onClose={mockClose} className="custom-modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('custom-modal');
  });

  test('renders header with close button by default', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Header>
          <Modal.Title>Test</Modal.Title>
        </Modal.Header>
      </Modal>
    );
    
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  test('can hide close button in header', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Header showCloseButton={false}>
          <Modal.Title>Test</Modal.Title>
        </Modal.Header>
      </Modal>
    );
    
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  test('renders footer correctly', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Body>Content</Modal.Body>
        <Modal.Footer>
          <button>Save</button>
          <Modal.CloseButton>Cancel</Modal.CloseButton>
        </Modal.Footer>
      </Modal>
    );
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('Modal.CloseButton calls onClose when clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockClose}>
        <Modal.Footer>
          <Modal.CloseButton>Cancel</Modal.CloseButton>
        </Modal.Footer>
      </Modal>
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('Legacy modal works with title prop', () => {
    render(
      <Modal.Legacy isOpen={true} onClose={mockClose} title="Legacy Modal">
        <p>Legacy content</p>
      </Modal.Legacy>
    );
    
    expect(screen.getByText('Legacy Modal')).toBeInTheDocument();
    expect(screen.getByText('Legacy content')).toBeInTheDocument();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });
});
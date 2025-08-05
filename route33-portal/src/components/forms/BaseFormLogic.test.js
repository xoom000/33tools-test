import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';  
import { useBaseFormLogic } from './BaseFormLogic';

describe('useBaseFormLogic Hook', () => {
  const mockFields = [
    { name: 'email', defaultValue: '', type: 'email' },
    { name: 'password', defaultValue: '', type: 'password' },
    { name: 'name', defaultValue: '', type: 'text' }
  ];

  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values from fields', () => {
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
      })
    );
    
    expect(result.current.formData).toEqual({
      email: '',
      password: '',
      name: ''
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  test('initializes with provided initial data', () => {
    const initialData = {
      email: 'test@example.com',
      name: 'John Doe'
    };

    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        initialData,
        onSave: mockOnSave
      })
    );
    
    expect(result.current.formData).toEqual({
      email: 'test@example.com',
      password: '',
      name: 'John Doe'
    });
  });

  test('handles field changes correctly', () => {
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
      })
    );
    
    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });
    
    expect(result.current.formData.email).toBe('test@example.com');
    expect(result.current.formData.password).toBe(''); // Other fields unchanged
  });

  test('clears error on field change', () => {
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
      })
    );
    
    // Set an error first
    act(() => {
      result.current.setError('Some error');
    });
    
    expect(result.current.error).toBe('Some error');
    
    // Change a field - should clear error
    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });
    
    expect(result.current.error).toBe('');
  });

  test('handles successful form submission', async () => {
    mockOnSave.mockResolvedValue();
    
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave,
        onClose: mockOnClose
      })
    );
    
    // Fill some form data
    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('name', 'John Doe');
    });
    
    // Create mock event
    const mockEvent = { preventDefault: jest.fn() };
    
    // Submit form
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '',
      name: 'John Doe'
    });
    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  test('handles form submission without onClose', async () => {
    mockOnSave.mockResolvedValue();
    
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
        // No onClose provided
      })
    );
    
    const mockEvent = { preventDefault: jest.fn() };
    
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    expect(mockOnSave).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled(); // Should not be called
  });

  test('handles form submission errors', async () => {
    const errorMessage = 'Save failed';
    mockOnSave.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave,
        onClose: mockOnClose
      })
    );
    
    const mockEvent = { preventDefault: jest.fn() };
    
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(mockOnClose).not.toHaveBeenCalled(); // Should not close on error
  });

  test('handles form submission errors without message', async () => {
    mockOnSave.mockRejectedValue(new Error());
    
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
      })
    );
    
    const mockEvent = { preventDefault: jest.fn() };
    
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    expect(result.current.error).toBe('An error occurred');
  });

  test('sets loading state during submission', async () => {
    let resolvePromise;
    const savePromise = new Promise(resolve => { resolvePromise = resolve; });
    mockOnSave.mockReturnValue(savePromise);
    
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
      })
    );
    
    const mockEvent = { preventDefault: jest.fn() };
    
    // Start submission
    act(() => {
      result.current.handleSubmit(mockEvent);
    });
    
    expect(result.current.loading).toBe(true);
    
    // Resolve the promise
    await act(async () => {
      resolvePromise();
      await savePromise;
    });
    
    expect(result.current.loading).toBe(false);
  });

  test('handles null or undefined fields gracefully', () => {
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: null,
        onSave: mockOnSave
      })
    );
    
    expect(result.current.formData).toEqual({});
  });

  test('handles non-array fields gracefully', () => {
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: 'not-an-array',
        onSave: mockOnSave
      })
    );
    
    expect(result.current.formData).toEqual({});
  });

  test('merges initial data with field defaults correctly', () => {
    const fieldsWithDefaults = [
      { name: 'email', defaultValue: 'default@example.com' },
      { name: 'name', defaultValue: 'Default Name' },
      { name: 'age', defaultValue: 18 }
    ];

    const initialData = {
      email: 'provided@example.com',
      // name is missing - should use default
      age: 25
    };

    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: fieldsWithDefaults,
        initialData,
        onSave: mockOnSave
      })
    );
    
    expect(result.current.formData).toEqual({
      email: 'provided@example.com', // From initial data
      name: 'Default Name',         // From field default
      age: 25                       // From initial data
    });
  });

  test('allows manual error setting', () => {
    const { result } = renderHook(() => 
      useBaseFormLogic({ 
        fields: mockFields,
        onSave: mockOnSave
      })
    );
    
    expect(result.current.error).toBe('');
    
    act(() => {
      result.current.setError('Custom error message');
    });
    
    expect(result.current.error).toBe('Custom error message');
  });
});
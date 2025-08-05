import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useModalManager } from './useModalManager';

describe('useModalManager Hook', () => {
  test('initializes with default admin modals closed', () => {
    const { result } = renderHook(() => useModalManager());
    
    expect(result.current.modals.showAddCustomer).toBe(false);
    expect(result.current.modals.showEditCustomer).toBe(false);
    expect(result.current.modals.showAddItem).toBe(false);
    expect(result.current.modals.showTokenGenerator).toBe(false);
    expect(result.current.modals.showSyncModal).toBe(false);
    expect(result.current.isAnyModalOpen).toBe(false);
  });

  test('opens modal with show prefix', () => {
    const { result } = renderHook(() => useModalManager());
    
    act(() => {
      result.current.openModal('AddCustomer');
    });
    
    expect(result.current.modals.showAddCustomer).toBe(true);
    expect(result.current.isAnyModalOpen).toBe(true);
  });

  test('closes modal with show prefix', () => {
    const { result } = renderHook(() => useModalManager());
    
    // First open it
    act(() => {
      result.current.openModal('AddCustomer');
    });
    
    expect(result.current.modals.showAddCustomer).toBe(true);
    
    // Then close it
    act(() => {
      result.current.closeModal('AddCustomer');
    });
    
    expect(result.current.modals.showAddCustomer).toBe(false);
    expect(result.current.isAnyModalOpen).toBe(false);
  });

  test('closes all modals', () => {
    const { result } = renderHook(() => useModalManager());
    
    // Open multiple modals
    act(() => {
      result.current.openModal('AddCustomer');
      result.current.openModal('EditCustomer');
      result.current.openModal('AddItem');
    });
    
    expect(result.current.modals.showAddCustomer).toBe(true);
    expect(result.current.modals.showEditCustomer).toBe(true);
    expect(result.current.modals.showAddItem).toBe(true);
    expect(result.current.isAnyModalOpen).toBe(true);
    
    // Close all
    act(() => {
      result.current.closeAllModals();
    });
    
    expect(result.current.modals.showAddCustomer).toBe(false);
    expect(result.current.modals.showEditCustomer).toBe(false);
    expect(result.current.modals.showAddItem).toBe(false);
    expect(result.current.isAnyModalOpen).toBe(false);
  });

  test('accepts initial modals', () => {
    const customModals = { customModal: true };
    const { result } = renderHook(() => useModalManager(customModals));
    
    expect(result.current.modals.customModal).toBe(true);
    expect(result.current.modals.showAddCustomer).toBe(false); // Default modals still there
  });

  test('detects when any modal is open', () => {
    const { result } = renderHook(() => useModalManager());
    
    expect(result.current.isAnyModalOpen).toBe(false);
    
    act(() => {
      result.current.openModal('TokenGenerator');
    });
    
    expect(result.current.isAnyModalOpen).toBe(true);
  });
});
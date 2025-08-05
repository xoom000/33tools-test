# Modal Compound Component Examples

## Basic Usage (New Compound Pattern)

```jsx
import Modal from './Modal';

// Flexible compound component approach
<Modal isOpen={isOpen} onClose={onClose} size="large">
  <Modal.Header>
    <Modal.Title>Add New Customer</Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    <form>
      <input type="text" placeholder="Customer name" />
      <input type="email" placeholder="Email" />
    </form>
  </Modal.Body>
  
  <Modal.Footer>
    <Modal.CloseButton>Cancel</Modal.CloseButton>
    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
      Save Customer
    </button>
  </Modal.Footer>
</Modal>
```

## Advanced Usage

```jsx
// Custom styled modal with no default close button in header
<Modal isOpen={isOpen} onClose={onClose} size="xlarge">
  <Modal.Header showCloseButton={false} className="bg-primary-50">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm">📊</span>
      </div>
      <div>
        <Modal.Title className="text-primary-900">
          Database Update Preview
        </Modal.Title>
        <p className="text-sm text-primary-600">Review changes before applying</p>
      </div>
    </div>
  </Modal.Header>
  
  <Modal.Body className="p-0">
    <div className="px-6 py-4 border-b">
      <StatsGrid stats={stats} />
    </div>
    <div className="px-6 py-4">
      <PreviewTable data={data} />
    </div>
  </Modal.Body>
  
  <Modal.Footer className="bg-slate-50">
    <Modal.CloseButton variant="outline">Cancel</Modal.CloseButton>
    <button 
      onClick={handleApply}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Apply Changes
    </button>
  </Modal.Footer>
</Modal>
```

## Legacy Compatibility

```jsx
// Still works for existing code - backward compatible
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  title="Legacy Modal"
  showCloseButton={true}
>
  Legacy content here
</Modal>

// Or use explicit legacy wrapper
<Modal.Legacy 
  isOpen={isOpen} 
  onClose={onClose}
  title="Legacy Modal"
>
  Legacy content here
</Modal.Legacy>
```

## Benefits of Compound Pattern

1. **Flexibility**: Customize any part of the modal structure
2. **Composition**: Mix and match components as needed
3. **Reusability**: Components can be styled independently
4. **Accessibility**: Built-in focus management and ARIA attributes
5. **Backward Compatibility**: Existing modals continue to work unchanged

## Migration Guide

### Before (Rigid):
```jsx
<Modal title="Settings" showCloseButton={true}>
  <div>Content</div>
</Modal>
```

### After (Flexible):
```jsx
<Modal>
  <Modal.Header>
    <Modal.Title>Settings</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div>Content</div>
  </Modal.Body>
</Modal>
```
// Search and highlighting utilities

export const highlightSearchTerm = (text, searchTerm, highlightClass = "bg-yellow-200 text-yellow-900 rounded px-1") => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className={highlightClass}>
        {part}
      </mark>
    ) : (
      part
    )
  );
};

// Additional search utilities for future use
export const normalizeSearchTerm = (term) => {
  return term.toLowerCase().trim();
};

export const searchFilter = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;
  
  const normalizedTerm = normalizeSearchTerm(searchTerm);
  
  return items.filter(item => 
    searchFields.some(field => {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], item)
        : item[field];
      
      return value?.toString().toLowerCase().includes(normalizedTerm);
    })
  );
};

export const highlightMatches = (text, searchTerm, options = {}) => {
  const {
    caseSensitive = false,
    wholeWord = false,
    highlightClass = "bg-yellow-200 text-yellow-900 rounded px-1"
  } = options;
  
  if (!searchTerm || !text) return text;
  
  const flags = caseSensitive ? 'g' : 'gi';
  const pattern = wholeWord ? `\\b(${searchTerm})\\b` : `(${searchTerm})`;
  const regex = new RegExp(pattern, flags);
  
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className={highlightClass}>
        {part}
      </mark>
    ) : (
      part
    )
  );
};
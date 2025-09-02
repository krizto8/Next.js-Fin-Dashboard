// Utility functions for formatting data based on field types and format options
export const formatFieldValue = (value, formatType = 'default', fieldType = 'string') => {
  if (value === null || value === undefined) return 'N/A';

  try {
    switch (formatType) {
      // String formatting
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'capitalize':
        return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();

      // Number formatting
      case 'currency':
      case 'currency-usd':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(parseFloat(value));
      
      case 'currency-eur':
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(parseFloat(value));
      
      case 'currency-compact':
        const num = parseFloat(value);
        if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
        return `$${num.toFixed(2)}`;

      case 'percentage':
      case 'percentage-2':
        return `${parseFloat(value).toFixed(2)}%`;
      
      case 'percentage-0':
        return `${Math.round(parseFloat(value))}%`;
      
      case 'percentage-sign':
        const pctValue = parseFloat(value);
        const sign = pctValue >= 0 ? '+' : '';
        return `${sign}${pctValue.toFixed(2)}%`;

      case 'decimal-0':
        return Math.round(parseFloat(value)).toLocaleString();
      
      case 'decimal-2':
        return parseFloat(value).toFixed(2);
      
      case 'scientific':
        return parseFloat(value).toExponential(2);

      // Date formatting
      case 'date-short':
        return new Date(value).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        });
      
      case 'date-long':
        return new Date(value).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'date-iso':
        return new Date(value).toISOString().split('T')[0];
      
      case 'date-relative':
        return getRelativeTime(new Date(value));

      // Default formatting based on field type
      case 'default':
      default:
        return formatDefaultValue(value, fieldType);
    }
  } catch (error) {
    console.warn('Error formatting value:', error);
    return String(value);
  }
};

const formatDefaultValue = (value, fieldType) => {
  switch (fieldType) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    case 'currency':
      // Try to extract number from currency string
      const match = String(value).match(/[\d,]+\.?\d*/);
      if (match) {
        const num = parseFloat(match[0].replace(/,/g, ''));
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(num);
      }
      return value;
    case 'percentage':
      return value; // Keep as-is since it already includes %
    case 'date':
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    default:
      return value;
  }
};

const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};

// Extract field value from nested object using dot notation path
export const getFieldValue = (data, fieldPath) => {
  if (!data || !fieldPath) return null;
  
  const keys = fieldPath.split('.');
  let current = data;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return null;
    }
    current = current[key];
  }
  
  return current;
};

// Get human-readable field name from path
export const getFieldDisplayName = (fieldPath) => {
  if (!fieldPath) return '';
  
  const parts = fieldPath.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Convert camelCase or snake_case to readable format
  return lastPart
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
    .trim();
};

// Validate if a field path exists in the data
export const isValidFieldPath = (data, fieldPath) => {
  return getFieldValue(data, fieldPath) !== null;
};

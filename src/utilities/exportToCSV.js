/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column IDs to include
 * @param {Object} columnMap - Mapping of column IDs to display names
 * @param {boolean} includeHeaders - Whether to include headers
 * @returns {string} CSV content
 */
export const exportToCSV = (data, columns, columnMap = {}, includeHeaders = true) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No data to export');
  }

  if (!columns || !Array.isArray(columns) || columns.length === 0) {
    throw new Error('No columns specified for export');
  }

  // Prepare headers
  const headers = columns.map(col => {
    const header = columnMap[col] || formatHeader(col);
    // Escape quotes and wrap in quotes if contains comma
    return escapeCSVValue(header);
  });

  // Prepare rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = getNestedValue(item, col);
      return escapeCSVValue(formatValue(value, col));
    });
  });

  // Combine headers and rows
  const csvContent = [
    includeHeaders ? headers.join(',') : null,
    ...rows.map(row => row.join(','))
  ].filter(Boolean).join('\n');

  return csvContent;
};

/**
 * Export data to JSON format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column IDs to include
 * @returns {string} JSON content
 */
export const exportToJSON = (data, columns) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No data to export');
  }

  const filteredData = data.map(item => {
    const filteredItem = {};
    columns.forEach(col => {
      filteredItem[col] = getNestedValue(item, col);
    });
    return filteredItem;
  });

  return JSON.stringify(filteredData, null, 2);
};

/**
 * Format a value for CSV export
 * @param {*} value - The value to format
 * @param {string} column - The column ID
 * @returns {string} Formatted value
 */
const formatValue = (value, column) => {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle dates
  if (column.includes('date') || column.includes('Date') || column.includes('At')) {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return String(value);
    }
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.join('; ');
  }

  // Handle objects
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

/**
 * Escape a value for CSV
 * @param {string} value - The value to escape
 * @returns {string} Escaped value
 */
const escapeCSVValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  
  // If value contains quotes, commas, or newlines, wrap in quotes and escape quotes
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - The object
 * @param {string} path - The path to the value
 * @returns {*} The value
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Format header from column ID
 * @param {string} column - The column ID
 * @returns {string} Formatted header
 */
const formatHeader = (column) => {
  // Convert camelCase to Title Case with spaces
  return column
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Download file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export const downloadFile = (content, filename, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate filename with timestamp
 * @param {string} baseName - Base filename
 * @param {string} extension - File extension
 * @returns {string} Generated filename
 */
export const generateFilename = (baseName, extension) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${baseName}-${timestamp}.${extension}`;
};
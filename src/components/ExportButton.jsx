import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Download, FileText, FileSpreadsheet, 
  Printer, Mail, ChevronDown, Check, 
  X, AlertCircle, RefreshCw, Eye
} from 'lucide-react';

const ExportButton = ({ 
  data = [],
  fileName = 'blood-donors',
  formats = ['csv', 'json', 'pdf'],
  onExport,
  className = '',
  disabled = false,
  showPreview = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'fullName', 'email', 'phone', 'bloodType', 'city', 'status'
  ]);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const allColumns = [
    { id: 'fullName', label: 'Full Name', selected: true },
    { id: 'email', label: 'Email', selected: true },
    { id: 'phone', label: 'Phone', selected: true },
    { id: 'bloodType', label: 'Blood Type', selected: true },
    { id: 'city', label: 'City', selected: true },
    { id: 'status', label: 'Status', selected: true },
    { id: 'age', label: 'Age', selected: false },
    { id: 'gender', label: 'Gender', selected: false },
    { id: 'address', label: 'Address', selected: false },
    { id: 'registeredAt', label: 'Registered Date', selected: false },
    { id: 'lastUpdated', label: 'Last Updated', selected: false },
    { id: 'emergencyContact', label: 'Emergency Contact', selected: false },
    { id: 'emergencyPhone', label: 'Emergency Phone', selected: false },
    { id: 'medicalConditions', label: 'Medical Conditions', selected: false }
  ];

  const formatOptions = [
    { id: 'csv', label: 'CSV', icon: <FileSpreadsheet className="w-4 h-4" />, color: 'text-green-600' },
    { id: 'json', label: 'JSON', icon: <FileText className="w-4 h-4" />, color: 'text-blue-600' },
    { id: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" />, color: 'text-red-600' },
    { id: 'print', label: 'Print', icon: <Printer className="w-4 h-4" />, color: 'text-gray-600' },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, color: 'text-purple-600' }
  ].filter(option => formats.includes(option.id));

  const filteredData = React.useMemo(() => {
    if (!dateRange.start && !dateRange.end) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.registeredAt || item.lastUpdated || Date.now());
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      
      return true;
    });
  }, [data, dateRange]);

  const getFormatIcon = (format) => {
    const option = formatOptions.find(opt => opt.id === format);
    return option ? option.icon : <FileText className="w-4 h-4" />;
  };

  const exportToCSV = (exportData, columns) => {
    const headers = columns.map(col => {
      const column = allColumns.find(c => c.id === col);
      return column ? column.label : col;
    });

    const rows = exportData.map(item => {
      return columns.map(col => {
        const value = item[col];
        // Handle special formatting
        if (col === 'registeredAt' || col === 'lastUpdated') {
          return new Date(value).toLocaleDateString();
        }
        return String(value || '').replace(/"/g, '""');
      });
    });

    const csvContent = [
      includeHeaders ? headers.join(',') : null,
      ...rows.map(row => row.join(','))
    ].filter(Boolean).join('\n');

    return csvContent;
  };

  const exportToJSON = (exportData, columns) => {
    const filtered = exportData.map(item => {
      const filteredItem = {};
      columns.forEach(col => {
        filteredItem[col] = item[col];
      });
      return filteredItem;
    });
    
    return JSON.stringify(filtered, null, 2);
  };

  const handleExport = async () => {
    if (filteredData.length === 0) {
      setExportStatus({
        type: 'error',
        message: 'No data to export'
      });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      let content, mimeType, extension;

      switch (selectedFormat) {
        case 'csv':
          content = exportToCSV(filteredData, selectedColumns);
          mimeType = 'text/csv';
          extension = 'csv';
          break;

        case 'json':
          content = exportToJSON(filteredData, selectedColumns);
          mimeType = 'application/json';
          extension = 'json';
          break;

        case 'pdf':
          // PDF would require a library like jsPDF or html2canvas
          // For now, we'll simulate it
          content = 'PDF export requires additional libraries';
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;

        case 'print':
          window.print();
          setIsExporting(false);
          setIsOpen(false);
          return;

        case 'email':
          // Email export would require backend integration
          content = 'Email export requires server integration';
          mimeType = 'text/plain';
          extension = 'txt';
          break;

        default:
          throw new Error('Unsupported format');
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create download
      if (selectedFormat !== 'print') {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}-${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      setExportStatus({
        type: 'success',
        message: `Exported ${filteredData.length} records as ${selectedFormat.toUpperCase()}`
      });

      // Call onExport callback if provided
      if (onExport) {
        onExport({
          format: selectedFormat,
          recordCount: filteredData.length,
          columns: selectedColumns,
          dateRange
        });
      }

      // Close dropdown after successful export
      setTimeout(() => {
        setIsOpen(false);
        setIsExporting(false);
      }, 1500);

    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({
        type: 'error',
        message: error.message || 'Export failed. Please try again.'
      });
      setIsExporting(false);
    }
  };

  const handleSelectAllColumns = (selectAll) => {
    if (selectAll) {
      setSelectedColumns(allColumns.map(col => col.id));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleColumnToggle = (columnId) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const renderPreview = () => {
    const previewData = filteredData.slice(0, 5); // Show first 5 rows
    
    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          Preview ({previewData.length} of {filteredData.length} records)
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {selectedColumns.map(col => {
                  const column = allColumns.find(c => c.id === col);
                  return (
                    <th key={col} className="py-2 px-3 text-left font-medium text-gray-700">
                      {column?.label || col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {previewData.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  {selectedColumns.map(col => (
                    <td key={col} className="py-2 px-3 text-gray-600">
                      {item[col] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || data.length === 0}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
          disabled || data.length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
        }`}
      >
        {isExporting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Export Data</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Message */}
            {exportStatus && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                exportStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {exportStatus.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{exportStatus.message}</span>
              </div>
            )}

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-5 gap-2">
                {formatOptions.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={format.color}>{format.icon}</div>
                    <span className="text-xs mt-1">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Start Date"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>

            {/* Column Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Columns ({selectedColumns.length}/{allColumns.length})
                </label>
                <button
                  onClick={() => handleSelectAllColumns(selectedColumns.length !== allColumns.length)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedColumns.length === allColumns.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                {allColumns.map(column => (
                  <label
                    key={column.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => handleColumnToggle(column.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="mb-6">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include headers in export</span>
              </label>
            </div>

            {/* Preview */}
            {showPreview && selectedColumns.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  Preview Data
                </button>
              </div>
            )}

            {/* Export Stats */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-1">
                  <span>Records to export:</span>
                  <span className="font-medium">{filteredData.length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Selected columns:</span>
                  <span className="font-medium">{selectedColumns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium uppercase">{selectedFormat}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedColumns.length === 0}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isExporting || selectedColumns.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Data Preview</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {renderPreview()}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ExportButton.propTypes = {
  data: PropTypes.array.isRequired,
  fileName: PropTypes.string,
  formats: PropTypes.arrayOf(PropTypes.oneOf(['csv', 'json', 'pdf', 'print', 'email'])),
  onExport: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showPreview: PropTypes.bool
};

ExportButton.defaultProps = {
  data: [],
  fileName: 'blood-donors',
  formats: ['csv', 'json', 'pdf'],
  disabled: false,
  showPreview: true
};

export default ExportButton;
import { useState, useMemo } from 'react';
import { FiChevronRight, FiChevronDown, FiType, FiHash, FiCalendar, FiDollarSign, FiPercent, FiEye, FiEyeOff } from 'react-icons/fi';

const FieldSelector = ({ data, selectedFields = [], onFieldToggle, formatOptions = {} }) => {
  const [expandedPaths, setExpandedPaths] = useState(new Set(['root']));

  // Flatten JSON structure to create field paths
  const flattenObject = (obj, prefix = '', result = {}) => {
    if (!obj || typeof obj !== 'object') {
      return result;
    }

    Object.keys(obj).forEach(key => {
      const path = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      result[path] = {
        key,
        path,
        value,
        type: getFieldType(value),
        isExpandable: typeof value === 'object' && value !== null && !Array.isArray(value),
        parent: prefix || null
      };

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenObject(value, path, result);
      }
    });

    return result;
  };

  const getFieldType = (value) => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') {
      // Try to detect special string types
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) return 'date';
      if (value.includes('%')) return 'percentage';
      if (value.match(/^\$?\d+(\.\d{2})?$/)) return 'currency';
      return 'string';
    }
    return 'unknown';
  };

  const getFieldIcon = (type) => {
    switch (type) {
      case 'number': return <FiHash className="w-4 h-4 text-blue-500" />;
      case 'string': return <FiType className="w-4 h-4 text-green-500" />;
      case 'date': return <FiCalendar className="w-4 h-4 text-purple-500" />;
      case 'currency': return <FiDollarSign className="w-4 h-4 text-yellow-500" />;
      case 'percentage': return <FiPercent className="w-4 h-4 text-orange-500" />;
      default: return <FiType className="w-4 h-4 text-gray-500" />;
    }
  };

  const fields = useMemo(() => flattenObject(data), [data]);

  const toggleExpand = (path) => {
    const newExpanded = new Set(expandedPaths);
    if (expandedPaths.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const getVisibleFields = () => {
    const visible = [];
    const paths = Object.keys(fields).sort();

    paths.forEach(path => {
      const field = fields[path];
      const pathParts = path.split('.');
      
      // Check if all parent paths are expanded
      let shouldShow = true;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const parentPath = pathParts.slice(0, i + 1).join('.');
        if (!expandedPaths.has(parentPath)) {
          shouldShow = false;
          break;
        }
      }

      if (shouldShow && !field.isExpandable) {
        visible.push(field);
      }
    });

    return visible;
  };

  const renderFieldRow = (field) => {
    const isSelected = selectedFields.includes(field.path);
    const fieldFormat = formatOptions[field.path] || 'default';
    const depth = field.path.split('.').length - 1;

    return (
      <div 
        key={field.path}
        className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' : ''
        }`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <button
          onClick={() => onFieldToggle(field.path)}
          className="flex items-center space-x-2 flex-1 text-left"
        >
          {isSelected ? (
            <FiEye className="w-4 h-4 text-blue-500" />
          ) : (
            <FiEyeOff className="w-4 h-4 text-gray-400" />
          )}
          
          {getFieldIcon(field.type)}
          
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {field.key}
          </span>
          
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {field.type}
          </span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 max-w-32 truncate">
            {typeof field.value === 'string' ? field.value : JSON.stringify(field.value)}
          </span>
          
          {isSelected && (
            <FormatSelector 
              fieldType={field.type}
              currentFormat={fieldFormat}
              onChange={(format) => onFieldToggle(field.path, format)}
            />
          )}
        </div>
      </div>
    );
  };

  const renderExpandableRow = (field) => {
    const isExpanded = expandedPaths.has(field.path);
    const depth = field.path.split('.').length - 1;

    return (
      <div 
        key={field.path}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => toggleExpand(field.path)}
      >
        {isExpanded ? (
          <FiChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-gray-500" />
        )}
        
        <FiType className="w-4 h-4 text-gray-500" />
        
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {field.key}
        </span>
        
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
          object
        </span>
      </div>
    );
  };

  const allFields = Object.values(fields).sort((a, b) => a.path.localeCompare(b.path));

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Available Fields ({getVisibleFields().length} fields)
      </div>
      
      <div className="max-h-64 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
        {allFields.map(field => 
          field.isExpandable 
            ? renderExpandableRow(field)
            : renderFieldRow(field)
        )}
      </div>

      {selectedFields.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Fields ({selectedFields.length})
          </div>
          <div className="space-y-1">
            {selectedFields.map(fieldPath => {
              const field = fields[fieldPath];
              if (!field) return null;
              return (
                <div key={fieldPath} className="flex items-center justify-between text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <span>{field.path}</span>
                  <span className="text-xs text-gray-500">
                    {formatOptions[fieldPath] || 'default'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FormatSelector = ({ fieldType, currentFormat, onChange }) => {
  const getFormatOptions = (type) => {
    const common = [
      { value: 'default', label: 'Default' },
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'lowercase', label: 'lowercase' },
      { value: 'capitalize', label: 'Capitalize' }
    ];

    switch (type) {
      case 'number':
        return [
          { value: 'default', label: 'Default' },
          { value: 'currency', label: '$1,234.56' },
          { value: 'percentage', label: '12.34%' },
          { value: 'decimal-2', label: '1234.56' },
          { value: 'decimal-0', label: '1235' },
          { value: 'scientific', label: '1.23e+3' }
        ];
      case 'currency':
        return [
          { value: 'default', label: 'Default' },
          { value: 'currency-usd', label: '$1,234.56' },
          { value: 'currency-eur', label: '€1,234.56' },
          { value: 'currency-compact', label: '$1.2K' }
        ];
      case 'percentage':
        return [
          { value: 'default', label: 'Default' },
          { value: 'percentage-2', label: '12.34%' },
          { value: 'percentage-0', label: '12%' },
          { value: 'percentage-sign', label: '+12.34%' }
        ];
      case 'date':
        return [
          { value: 'default', label: 'Default' },
          { value: 'date-short', label: '12/31/2023' },
          { value: 'date-long', label: 'December 31, 2023' },
          { value: 'date-iso', label: '2023-12-31' },
          { value: 'date-relative', label: '2 days ago' }
        ];
      default:
        return common;
    }
  };

  const options = getFormatOptions(fieldType);

  return (
    <select
      value={currentFormat}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FieldSelector;

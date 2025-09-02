import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiSave } from 'react-icons/fi';
import { updateWidgetConfig } from '../../store/slices/dashboardSlice';
import FieldSelector from '../common/FieldSelector';

export default function WidgetConfigModal({ isOpen, onClose, widgetId }) {
  const dispatch = useDispatch();
  const widget = useSelector((state) => 
    state.dashboard.widgets.find(w => w.id === widgetId)
  );

  const [config, setConfig] = useState({});

  useEffect(() => {
    if (widget) {
      setConfig({ ...widget.config });
    }
  }, [widget]);

  if (!isOpen || !widget) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateWidgetConfig({ id: widgetId, config }));
    onClose();
  };

  const renderTypeSpecificConfig = () => {
    switch (widget.type) {
      case 'chart':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chart Type
              </label>
              <select
                value={config.chartType || 'line'}
                onChange={(e) => setConfig({ ...config, chartType: e.target.value })}
                className="select"
              >
                <option value="line">Line Chart</option>
                <option value="candlestick">OHLC Chart</option>
                <option value="volume">Volume Chart</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Interval
              </label>
              <select
                value={config.interval || 'daily'}
                onChange={(e) => setConfig({ ...config, interval: e.target.value })}
                className="select"
              >
                <option value="intraday">Intraday (5min)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        );
        
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Card Type
              </label>
              <select
                value={config.cardType || 'quote'}
                onChange={(e) => setConfig({ ...config, cardType: e.target.value })}
                className="select"
              >
                <option value="quote">Stock Quote</option>
                <option value="gainers">Top Gainers</option>
                <option value="losers">Top Losers</option>
                <option value="active">Most Active</option>
              </select>
            </div>
          </div>
        );
        
      case 'table':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Source
              </label>
              <select
                value={config.tableType || 'quote'}
                onChange={(e) => setConfig({ ...config, tableType: e.target.value })}
                className="select"
              >
                <option value="quote">Stock Quote</option>
                <option value="timeseries">Time Series Data</option>
                <option value="search">Symbol Search</option>
                <option value="gainers_losers">Top Gainers/Losers</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Configure Widget
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Widget Title
              </label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="Widget Title"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Symbol
              </label>
              <input
                type="text"
                value={config.symbol || ''}
                onChange={(e) => setConfig({ ...config, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
                className="input"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter a valid stock symbol (e.g., AAPL, GOOGL, MSFT)
              </p>
            </div>

            {/* Type-specific configuration */}
            {renderTypeSpecificConfig()}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refresh Interval
              </label>
              <select
                value={config.refreshInterval || 30000}
                onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                className="select"
              >
                <option value={15000}>15 seconds</option>
                <option value={30000}>30 seconds</option>
                <option value={60000}>1 minute</option>
                <option value={300000}>5 minutes</option>
                <option value={900000}>15 minutes</option>
              </select>
            </div>

            {/* API Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Provider
              </label>
              <select
                value={config.apiProvider || 'alphavantage'}
                onChange={(e) => setConfig({ ...config, apiProvider: e.target.value })}
                className="select"
              >
                <option value="alphavantage">Alpha Vantage</option>
                <option value="finnhub">Finnhub</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose your data provider. Finnhub uses your environment API key.
              </p>
            </div>

            {/* API Endpoint Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Endpoint (Advanced)
              </label>
              <input
                type="text"
                value={config.apiEndpoint || ''}
                onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
                placeholder="Leave empty to use default"
                className="input"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Custom API endpoint (leave empty to use Alpha Vantage default)
              </p>
            </div>

            {/* Display Fields Configuration */}
            {widget.data && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Field Selection & Formatting
                </label>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <FieldSelector
                    data={widget.data}
                    selectedFields={config.displayFields || []}
                    formatOptions={config.fieldFormats || {}}
                    onFieldToggle={(fieldPath, format) => {
                      const newDisplayFields = [...(config.displayFields || [])];
                      const newFieldFormats = { ...(config.fieldFormats || {}) };
                      
                      if (newDisplayFields.includes(fieldPath)) {
                        // Remove field
                        const index = newDisplayFields.indexOf(fieldPath);
                        newDisplayFields.splice(index, 1);
                        delete newFieldFormats[fieldPath];
                      } else {
                        // Add field
                        newDisplayFields.push(fieldPath);
                        if (format && format !== 'default') {
                          newFieldFormats[fieldPath] = format;
                        }
                      }
                      
                      setConfig({
                        ...config,
                        displayFields: newDisplayFields,
                        fieldFormats: newFieldFormats
                      });
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select fields to display and choose formatting options. Widget must have data loaded to see available fields.
                </p>
              </div>
            )}

            {!widget.data && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Fields (Manual Entry)
                </label>
                <textarea
                  value={config.displayFields?.join(', ') || ''}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    displayFields: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                  })}
                  placeholder="field1, field2, field3"
                  className="input"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Comma-separated list of fields. Load widget data first to use interactive field selector.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <FiSave className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

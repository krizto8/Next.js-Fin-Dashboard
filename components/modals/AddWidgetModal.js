import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiX, FiGrid, FiBarChart, FiCreditCard } from 'react-icons/fi';
import { addWidget, setAddingWidget } from '../../store/slices/dashboardSlice';

export default function AddWidgetModal() {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState('');
  const [config, setConfig] = useState({
    title: '',
    symbol: 'AAPL',
    interval: 'daily',
    chartType: 'line',
    cardType: 'quote',
    refreshInterval: 30000,
    apiProvider: 'alphavantage',
  });

  const widgetTypes = [
    {
      id: 'table',
      name: 'Stock Table',
      icon: FiGrid,
      description: 'Display stock data in a searchable, sortable table format',
      color: 'bg-green-500',
    },
    {
      id: 'chart',
      name: 'Stock Chart',
      icon: FiBarChart,
      description: 'Visualize stock price trends with interactive charts',
      color: 'bg-blue-500',
    },
    {
      id: 'card',
      name: 'Stock Card',
      icon: FiCreditCard,
      description: 'Show key metrics and data in a compact card format',
      color: 'bg-purple-500',
    },
  ];

  const handleClose = () => {
    dispatch(setAddingWidget(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedType || !config.title) {
      alert('Please select a widget type and enter a title');
      return;
    }

    const finalConfig = {
      ...config,
      title: config.title || `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Widget`,
    };

    dispatch(addWidget({
      type: selectedType,
      config: finalConfig,
    }));

    handleClose();
  };

  const renderConfigOptions = () => {
    switch (selectedType) {
      case 'chart':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chart Type
              </label>
              <select
                value={config.chartType}
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
                value={config.interval}
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
                value={config.cardType}
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add New Widget
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Widget Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Select Widget Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {widgetTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Configuration */}
          {selectedType && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Widget Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder={`My ${selectedType} Widget`}
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
                    value={config.symbol}
                    onChange={(e) => setConfig({ ...config, symbol: e.target.value.toUpperCase() })}
                    placeholder="AAPL"
                    className="input"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter a valid stock symbol (e.g., AAPL, GOOGL, MSFT)
                  </p>
                </div>
              </div>

              {/* Type-specific configuration */}
              {renderConfigOptions()}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refresh Interval
                </label>
                <select
                  value={config.refreshInterval}
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
                  value={config.apiProvider}
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
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedType || !config.title}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

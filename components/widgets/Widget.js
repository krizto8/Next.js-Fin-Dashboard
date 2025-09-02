import { useDispatch } from 'react-redux';
import { FiSettings, FiX, FiRefreshCw } from 'react-icons/fi';
import { removeWidget } from '../../store/slices/dashboardSlice';
import StockTable from './types/StockTable';
import StockChart from './types/StockChart';
import StockCard from './types/StockCard';

export default function Widget({ widget, onSelect, onConfig, isSelected }) {
  const dispatch = useDispatch();

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Remove widget clicked for:', widget.id);
    if (window.confirm('Are you sure you want to remove this widget?')) {
      console.log('Dispatching removeWidget for:', widget.id);
      dispatch(removeWidget(widget.id));
    }
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    // Trigger refresh for this specific widget
    window.dispatchEvent(new CustomEvent('refresh-widget', { detail: { widgetId: widget.id } }));
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'table':
        return <StockTable widget={widget} />;
      case 'chart':
        return <StockChart widget={widget} />;
      case 'card':
        return <StockCard widget={widget} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unknown widget type: {widget.type}
          </div>
        );
    }
  };

  return (
    <div
      className={`widget-container h-full flex flex-col ${
        isSelected ? 'ring-2 ring-primary-500 shadow-widget-hover' : 'shadow-widget'
      }`}
    >
      {/* Widget Header */}
      <div className="widget-header flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center min-w-0 flex-1" onClick={onSelect}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {widget.title}
          </h3>
          {widget.loading && (
            <div className="ml-2 loading-spinner" />
          )}
        </div>
        
        <div className="flex items-center space-x-1 ml-4" onClick={(e) => e.stopPropagation()}>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleRefresh}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh widget"
            type="button"
          >
            <FiRefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onConfig();
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Configure widget"
            type="button"
          >
            <FiSettings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleRemove}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Remove widget"
            type="button"
          >
            <FiX className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="widget-body flex-1 overflow-hidden">
        {widget.error ? (
          <div className="error-state">
            <div className="text-red-600 dark:text-red-400 mb-2">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium">Error loading data</p>
            <p className="text-sm mt-1">{widget.error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 btn-primary text-sm"
            >
              Try Again
            </button>
          </div>
        ) : widget.loading ? (
          <div className="error-state">
            <div className="loading-spinner mx-auto mb-4" />
            <p>Loading data...</p>
          </div>
        ) : !widget.data ? (
          <div className="error-state">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2M4 9h2" />
              </svg>
            </div>
            <p>No data available</p>
            <button
              onClick={handleRefresh}
              className="mt-4 btn-secondary text-sm"
            >
              Load Data
            </button>
          </div>
        ) : (
          renderWidgetContent()
        )}
      </div>

      {/* Widget Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {widget.lastUpdated 
            ? `Last updated: ${new Date(widget.lastUpdated).toLocaleTimeString()}`
            : 'No data loaded'
          }
        </p>
      </div>
    </div>
  );
}

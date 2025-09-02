import { useSelector } from 'react-redux';
import { 
  FiX, 
  FiActivity, 
  FiList, 
  FiFile, 
  FiSettings, 
  FiInfo,
  FiLayout 
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose, onOpenTemplates }) {
  const { widgets, refreshInterval } = useSelector((state) => state.dashboard);
  const { apiCallsCount, lastApiCall } = useSelector((state) => state.api);

  const widgetStats = {
    total: widgets.length,
    charts: widgets.filter(w => w.type === 'chart').length,
    tables: widgets.filter(w => w.type === 'table').length,
    cards: widgets.filter(w => w.type === 'card').length,
  };

  const formatLastApiCall = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 dark:border-gray-700
        min-h-screen lg:min-h-[calc(100vh-4rem)]
      `}>
        <div className="flex flex-col h-full min-h-screen lg:min-h-[calc(100vh-4rem)]">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dashboard Info
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <FiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <FiLayout className="h-4 w-4 mr-2" />
                Quick Start
              </h3>
              <button
                onClick={() => {
                  onOpenTemplates?.();
                  onClose();
                }}
                className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
              >
                <FiLayout className="h-4 w-4" />
                Browse Dashboard Templates
              </button>
            </div>

            {/* Widget Statistics */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <FiActivity className="h-4 w-4 mr-2" />
                Widget Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Widgets</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{widgetStats.total}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <FiActivity className="h-5 w-5 mx-auto text-blue-600 dark:text-blue-400 mb-1" />
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{widgetStats.charts}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Charts</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <FiList className="h-5 w-5 mx-auto text-green-600 dark:text-green-400 mb-1" />
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">{widgetStats.tables}</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Tables</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <FiFile className="h-5 w-5 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{widgetStats.cards}</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Cards</div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <FiSettings className="h-4 w-4 mr-2" />
                API Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">API Calls Made</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{apiCallsCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last API Call</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatLastApiCall(lastApiCall)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Refresh Interval</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{refreshInterval / 1000}s</span>
                </div>
              </div>
            </div>

            {/* Active Widgets */}
            {widgets.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <FiFile className="h-4 w-4 mr-2" />
                  Active Widgets
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {widget.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          widget.type === 'chart' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          widget.type === 'table' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                          {widget.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {widget.config.symbol || 'No symbol'}
                      </div>
                      {widget.lastUpdated && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
                        </div>
                      )}
                      {widget.loading && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Loading...
                        </div>
                      )}
                      {widget.error && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Error: {widget.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <FiInfo className="h-4 w-4 mr-2" />
                Information
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  • Drag widgets to rearrange them
                </p>
                <p>
                  • Resize widgets by dragging the corner
                </p>
                <p>
                  • Click on a widget to select it
                </p>
                <p>
                  • Use the config button to customize widgets
                </p>
                <p>
                  • Data refreshes automatically based on your settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

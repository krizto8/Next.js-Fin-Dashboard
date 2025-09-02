import { useDispatch, useSelector } from 'react-redux';
import { 
  FiMenu, 
  FiPlus, 
  FiRefreshCw, 
  FiSun, 
  FiMoon, 
  FiDownload, 
  FiUpload,
  FiTrash2,
  FiLayout 
} from 'react-icons/fi';
import { toggleTheme } from '../../store/slices/themeSlice';
import { clearDashboard, importDashboard } from '../../store/slices/dashboardSlice';
import { useRef } from 'react';

export default function Header({ onToggleSidebar, onAddWidget, onOpenTemplates }) {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.theme);
  const { widgets } = useSelector((state) => state.dashboard);
  const fileInputRef = useRef(null);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleExportDashboard = () => {
    const dashboardData = {
      widgets,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportDashboard = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.widgets) {
            dispatch(importDashboard(importedData));
          } else {
            alert('Invalid dashboard file format');
          }
        } catch (error) {
          alert('Error importing dashboard: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearDashboard = () => {
    if (window.confirm('Are you sure you want to clear all widgets? This action cannot be undone.')) {
      dispatch(clearDashboard());
    }
  };

  const refreshAllWidgets = () => {
    // This will trigger a refresh of all widgets
    window.dispatchEvent(new CustomEvent('refresh-all-widgets'));
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                Finance Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time market data and analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Refresh All */}
            <button
              onClick={refreshAllWidgets}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh all widgets"
            >
              <FiRefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Export Dashboard */}
            <button
              onClick={handleExportDashboard}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Export dashboard"
              disabled={widgets.length === 0}
            >
              <FiDownload className={`h-5 w-5 ${widgets.length === 0 ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`} />
            </button>

            {/* Import Dashboard */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Import dashboard"
            >
              <FiUpload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportDashboard}
              className="hidden"
            />

            {/* Templates */}
            <button
              onClick={onOpenTemplates}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Choose from templates"
            >
              <FiLayout className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Clear Dashboard */}
            <button
              onClick={handleClearDashboard}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Clear dashboard"
              disabled={widgets.length === 0}
            >
              <FiTrash2 className={`h-5 w-5 ${widgets.length === 0 ? 'text-gray-400' : 'text-danger-600 dark:text-danger-400'}`} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {currentTheme === 'dark' ? (
                <FiSun className="h-5 w-5 text-yellow-500" />
              ) : (
                <FiMoon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Add Widget */}
            <button
              onClick={onAddWidget}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add Widget</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

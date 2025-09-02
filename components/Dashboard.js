import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { updateLayout, selectWidget, setAddingWidget } from '../store/slices/dashboardSlice';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Widget from './widgets/Widget';
import AddWidgetModal from './modals/AddWidgetModal';
import WidgetConfigModal from './modals/WidgetConfigModal';
import LoadingOverlay from './common/LoadingOverlay';
import { useWidgetRefresh } from '../hooks/useWidgetRefresh';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { widgets, layout, selectedWidget, isAddingWidget } = useSelector((state) => state.dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Custom hook for widget refresh
  useWidgetRefresh();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLayoutChange = (newLayout) => {
    dispatch(updateLayout(newLayout));
  };

  const handleWidgetSelect = (widgetId) => {
    dispatch(selectWidget(widgetId));
  };

  const handleWidgetConfig = (widgetId) => {
    dispatch(selectWidget(widgetId));
    setIsConfigModalOpen(true);
  };

  const handleAddWidget = () => {
    dispatch(setAddingWidget(true));
  };

  if (!mounted) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddWidget={handleAddWidget}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6">
          {widgets.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Welcome to Finance Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Start building your personalized finance monitoring dashboard by adding widgets.
                </p>
                <button
                  onClick={handleAddWidget}
                  className="btn-primary"
                >
                  Add Your First Widget
                </button>
              </div>
            </div>
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={60}
              onLayoutChange={handleLayoutChange}
              isDraggable={true}
              isResizable={true}
              margin={[16, 16]}
              containerPadding={[0, 0]}
            >
              {widgets.map((widget) => (
                <div key={widget.id}>
                  <Widget
                    widget={widget}
                    onSelect={() => handleWidgetSelect(widget.id)}
                    onConfig={() => handleWidgetConfig(widget.id)}
                    isSelected={selectedWidget === widget.id}
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </main>
      </div>

      {/* Modals */}
      {isAddingWidget && <AddWidgetModal />}
      
      {isConfigModalOpen && selectedWidget && (
        <WidgetConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          widgetId={selectedWidget}
        />
      )}
    </div>
  );
}

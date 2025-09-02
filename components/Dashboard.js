import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { updateLayout, selectWidget, setAddingWidget } from '../store/slices/dashboardSlice';
import { closeConfigModal } from '../store/slices/apiConfigSlice';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Widget from './widgets/Widget';
import LoadingOverlay from './common/LoadingOverlay';
import TemplateShowcase from './common/TemplateShowcase';
import { useWidgetRefresh } from '../hooks/useWidgetRefresh';

// Lazy load modal components
const AddWidgetModal = lazy(() => import('./modals/AddWidgetModal'));
const WidgetConfigModal = lazy(() => import('./modals/WidgetConfigModal'));
const TemplateSelectionModal = lazy(() => import('./modals/TemplateSelectionModal'));
const ApiConfigModal = lazy(() => import('./modals/ApiConfigModal'));

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { widgets, layout, selectedWidget, isAddingWidget } = useSelector((state) => state.dashboard);
  const { isConfigModalOpen } = useSelector((state) => state.apiConfig);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWidgetConfigModalOpen, setIsWidgetConfigModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
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
    setIsWidgetConfigModalOpen(true);
  };

  const handleAddWidget = () => {
    dispatch(setAddingWidget(true));
  };

  const handleOpenTemplates = () => {
    setIsTemplateModalOpen(true);
  };

  if (!mounted) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddWidget={handleAddWidget}
        onOpenTemplates={handleOpenTemplates}
      />
      
      <div className="flex w-full">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenTemplates={handleOpenTemplates}
        />
        
        <main className="flex-1 p-4 sm:p-6 w-full min-w-0">{widgets.length === 0 ? (
            <TemplateShowcase 
              onSelectTemplate={handleOpenTemplates}
              onAddWidget={handleAddWidget}
            />
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={{ 
                lg: layout,
                md: layout,
                sm: layout,
                xs: layout,
                xxs: layout
              }}
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

      {/* Modals with lazy loading */}
      <Suspense fallback={<LoadingOverlay />}>
        {isAddingWidget && <AddWidgetModal />}
        
        {isWidgetConfigModalOpen && selectedWidget && (
          <WidgetConfigModal
            isOpen={isWidgetConfigModalOpen}
            onClose={() => setIsWidgetConfigModalOpen(false)}
            widgetId={selectedWidget}
          />
        )}
        
        {isTemplateModalOpen && (
          <TemplateSelectionModal
            isOpen={isTemplateModalOpen}
            onClose={() => setIsTemplateModalOpen(false)}
          />
        )}

        <ApiConfigModal 
          isOpen={isConfigModalOpen}
          onClose={() => dispatch(closeConfigModal())}
        />
      </Suspense>
    </div>
  );
}

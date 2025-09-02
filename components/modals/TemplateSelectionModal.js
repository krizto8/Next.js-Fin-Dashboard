import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  dashboardTemplates, 
  templateCategories, 
  getAllCategories,
  getTemplatesByCategory,
  applyDashboardTemplate 
} from '../../utils/dashboardTemplates';
import { applyTemplate, clearDashboard } from '../../store/slices/dashboardSlice';

const TemplateSelectionModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('Beginner');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleApplyTemplate = (template) => {
    const templateData = applyDashboardTemplate(template);
    
    // Apply the template using Redux action
    dispatch(applyTemplate(templateData));
    
    onClose();
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const categories = getAllCategories();
  const templatesInCategory = getTemplatesByCategory(selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl sm:text-2xl p-1"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Category Sidebar */}
          <div className="lg:w-1/4 w-full">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">Categories</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-0">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-2 sm:p-3 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">{templateCategories[category].icon}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{category}</div>
                      <div className="text-xs sm:text-sm opacity-75 hidden sm:block">
                        {templateCategories[category].description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="lg:w-3/4 w-full">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">
              {selectedCategory} Templates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {templatesInCategory.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {template.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      templateCategories[template.category].color === 'green'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : templateCategories[template.category].color === 'blue'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : templateCategories[template.category].color === 'orange'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {template.widgets.length} widgets
                    </span>
                  </div>

                  {/* Widget Preview */}
                  <div className="mb-4">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Includes:</div>
                    <div className="space-y-1">
                      {template.widgets.slice(0, 3).map((widget, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">{widget.title}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">({widget.type})</span>
                        </div>
                      ))}
                      {template.widgets.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                          +{template.widgets.length - 3} more widgets
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleApplyTemplate(template)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 truncate pr-2">
                  Template Preview: {previewTemplate.name}
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl flex-shrink-0 p-1"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{previewTemplate.description}</p>
              </div>

              {/* Detailed Widget List */}
              <div className="space-y-3 sm:space-y-4 mb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">Widgets Configuration:</h4>
                {previewTemplate.widgets.map((widget, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h5 className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate">{widget.title}</h5>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-300 self-start sm:self-auto">
                        {widget.type}
                      </span>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {widget.config.symbol && (
                        <div className="break-all"><span className="font-medium">Symbol:</span> {widget.config.symbol}</div>
                      )}
                      {widget.config.apiProvider && (
                        <div><span className="font-medium">Provider:</span> {widget.config.apiProvider}</div>
                      )}
                      {widget.config.refreshInterval && (
                        <div><span className="font-medium">Refresh:</span> {widget.config.refreshInterval / 1000}s</div>
                      )}
                      {widget.config.displayFields && widget.config.displayFields.length > 0 && (
                        <div className="break-all"><span className="font-medium">Fields:</span> {widget.config.displayFields.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleApplyTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Apply This Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelectionModal;

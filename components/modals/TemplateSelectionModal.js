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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex gap-6">
          {/* Category Sidebar */}
          <div className="w-1/4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{templateCategories[category].icon}</span>
                    <div>
                      <div className="font-medium">{category}</div>
                      <div className="text-sm opacity-75">
                        {templateCategories[category].description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="w-3/4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {selectedCategory} Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templatesInCategory.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      templateCategories[template.category].color === 'green'
                        ? 'bg-green-100 text-green-800'
                        : templateCategories[template.category].color === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : templateCategories[template.category].color === 'orange'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {template.widgets.length} widgets
                    </span>
                  </div>

                  {/* Widget Preview */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Includes:</div>
                    <div className="space-y-1">
                      {template.widgets.slice(0, 3).map((widget, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span className="text-gray-700">{widget.title}</span>
                          <span className="text-xs text-gray-500">({widget.type})</span>
                        </div>
                      ))}
                      {template.widgets.length > 3 && (
                        <div className="text-xs text-gray-500 ml-4">
                          +{template.widgets.length - 3} more widgets
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleApplyTemplate(template)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Template Preview: {previewTemplate.name}
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">{previewTemplate.description}</p>
              </div>

              {/* Detailed Widget List */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-800">Widgets Configuration:</h4>
                {previewTemplate.widgets.map((widget, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-800">{widget.title}</h5>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        {widget.type}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      {widget.config.symbol && (
                        <div><span className="font-medium">Symbol:</span> {widget.config.symbol}</div>
                      )}
                      {widget.config.apiProvider && (
                        <div><span className="font-medium">Provider:</span> {widget.config.apiProvider}</div>
                      )}
                      {widget.config.refreshInterval && (
                        <div><span className="font-medium">Refresh:</span> {widget.config.refreshInterval / 1000}s</div>
                      )}
                      {widget.config.displayFields && widget.config.displayFields.length > 0 && (
                        <div><span className="font-medium">Fields:</span> {widget.config.displayFields.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleApplyTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

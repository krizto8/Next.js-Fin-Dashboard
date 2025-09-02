import React from 'react';
import { templateCategories, dashboardTemplates } from '../../utils/dashboardTemplates';

const TemplateShowcase = ({ onSelectTemplate, onAddWidget }) => {
  const featuredTemplates = [
    dashboardTemplates.basic,
    dashboardTemplates.comprehensive,
    dashboardTemplates.crypto,
    dashboardTemplates.dayTrader
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
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
        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome to Finance Dashboard
        </h3>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Get started quickly with our pre-built templates or create your own custom dashboard
        </p>
      </div>

      {/* Quick Start Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Choose a Template
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start with professionally designed templates for different use cases
            </p>
            <button
              onClick={onSelectTemplate}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Templates
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Build from Scratch
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create a custom dashboard by adding widgets one by one
            </p>
            <button
              onClick={onAddWidget}
              className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Add First Widget
            </button>
          </div>
        </div>
      </div>

      {/* Featured Templates */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Popular Templates
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={onSelectTemplate}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">
                  {templateCategories[template.category].icon}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  templateCategories[template.category].color === 'green'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : templateCategories[template.category].color === 'blue'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : templateCategories[template.category].color === 'orange'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {template.category}
                </span>
              </div>
              
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {template.name}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.description}
              </p>
              
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {template.widgets.length} widgets included
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
          Template Categories
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(templateCategories).map(([category, info]) => (
            <div key={category} className="text-center">
              <div className="text-3xl mb-2">{info.icon}</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{category}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{info.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateShowcase;

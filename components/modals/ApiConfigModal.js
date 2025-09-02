import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSettings, FiCheck, FiX, FiEye, FiEyeOff, FiTrash2, FiPlus } from 'react-icons/fi';
import { 
  updateApiConfig, 
  closeConfigModal, 
  toggleApiProvider, 
  resetApiConfig,
  addCustomApiProvider 
} from '../../store/slices/apiConfigSlice';

const ApiConfigModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { configs } = useSelector((state) => state.apiConfig);
  const [showApiKeys, setShowApiKeys] = useState({});
  const [editingConfig, setEditingConfig] = useState(null);
  const [newProvider, setNewProvider] = useState({
    id: '',
    name: '',
    baseUrl: '',
    apiKey: '',
    enabled: false
  });
  const [showAddProvider, setShowAddProvider] = useState(false);

  if (!isOpen) return null;

  const toggleShowApiKey = (provider) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleSaveConfig = (provider, config) => {
    dispatch(updateApiConfig({ provider, config }));
    setEditingConfig(null);
  };

  const handleTestConnection = async (provider) => {
    const config = configs[provider];
    if (!config.apiKey || !config.baseUrl) {
      alert('Please configure API key and base URL first');
      return;
    }

    try {
      // Test with a simple quote request
      const testUrl = config.baseUrl + config.endpoints.quote
        .replace('{symbol}', 'AAPL')
        .replace('{apiKey}', config.apiKey);
      
      const response = await fetch(testUrl);
      if (response.ok) {
        alert(`✅ ${config.name} connection successful!`);
      } else {
        alert(`❌ ${config.name} connection failed: ${response.status}`);
      }
    } catch (error) {
      alert(`❌ ${config.name} connection error: ${error.message}`);
    }
  };

  const handleAddCustomProvider = () => {
    if (!newProvider.id || !newProvider.name || !newProvider.baseUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const customConfig = {
      name: newProvider.name,
      baseUrl: newProvider.baseUrl,
      apiKey: newProvider.apiKey,
      enabled: newProvider.enabled,
      endpoints: {
        quote: '/quote?symbol={symbol}&apikey={apiKey}',
        search: '/search?q={symbol}&apikey={apiKey}'
      }
    };

    dispatch(addCustomApiProvider({ id: newProvider.id, config: customConfig }));
    setNewProvider({ id: '', name: '', baseUrl: '', apiKey: '', enabled: false });
    setShowAddProvider(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <FiSettings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                API Configuration
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 flex-shrink-0"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Configure your API providers to fetch financial data
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Existing Providers */}
          {Object.entries(configs).map(([provider, config]) => (
            <div key={provider} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${config.enabled && config.apiKey ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {config.name}
                  </h3>
                  <button
                    onClick={() => dispatch(toggleApiProvider(provider))}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      config.enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {config.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTestConnection(provider)}
                    disabled={!config.apiKey}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => dispatch(resetApiConfig(provider))}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    <FiTrash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Base URL
                    </label>
                    <input
                      type="text"
                      value={config.baseUrl}
                      onChange={(e) => handleSaveConfig(provider, { baseUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys[provider] ? 'text' : 'password'}
                        value={config.apiKey}
                        onChange={(e) => handleSaveConfig(provider, { apiKey: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Enter your API key"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowApiKey(provider)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showApiKeys[provider] ? (
                          <FiEyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoints Preview */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Endpoints
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-xs overflow-x-auto">
                  {Object.entries(config.endpoints || {}).map(([name, endpoint]) => (
                    <div key={name} className="mb-1 break-all">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{name}:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{endpoint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Add Custom Provider */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 sm:p-4">
            {!showAddProvider ? (
              <button
                onClick={() => setShowAddProvider(true)}
                className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-2"
              >
                <FiPlus className="h-5 w-5" />
                <span className="text-sm sm:text-base">Add Custom API Provider</span>
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Add Custom Provider
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider ID *
                    </label>
                    <input
                      type="text"
                      value={newProvider.id}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="my_custom_api"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider Name *
                    </label>
                    <input
                      type="text"
                      value={newProvider.name}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="My Custom API"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Base URL *
                    </label>
                    <input
                      type="text"
                      value={newProvider.baseUrl}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, baseUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={newProvider.apiKey}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="Optional API key"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddCustomProvider}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex-1 sm:flex-initial"
                  >
                    Add Provider
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProvider(false);
                      setNewProvider({ id: '', name: '', baseUrl: '', apiKey: '', enabled: false });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm flex-1 sm:flex-initial"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              💡 Tip: Use {'{symbol}'} and {'{apiKey}'} placeholders in endpoints
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiSettings className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                API Configuration
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your API providers to fetch financial data
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Existing Providers */}
          {Object.entries(configs).map(([provider, config]) => (
            <div key={provider} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${config.enabled && config.apiKey ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {config.name}
                  </h3>
                  <button
                    onClick={() => dispatch(toggleApiProvider(provider))}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      config.enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {config.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(provider)}
                    disabled={!config.apiKey}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => dispatch(resetApiConfig(provider))}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base URL
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl}
                    onChange={(e) => handleSaveConfig(provider, { baseUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

              {/* Endpoints Preview */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Endpoints
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-xs">
                  {Object.entries(config.endpoints || {}).map(([name, endpoint]) => (
                    <div key={name} className="mb-1">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{name}:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{endpoint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Add Custom Provider */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
            {!showAddProvider ? (
              <button
                onClick={() => setShowAddProvider(true)}
                className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <FiPlus className="h-5 w-5" />
                Add Custom API Provider
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Add Custom Provider
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider ID *
                    </label>
                    <input
                      type="text"
                      value={newProvider.id}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Optional API key"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddCustomProvider}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Provider
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProvider(false);
                      setNewProvider({ id: '', name: '', baseUrl: '', apiKey: '', enabled: false });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              💡 Tip: Use {'{symbol}'} and {'{apiKey}'} placeholders in endpoints
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

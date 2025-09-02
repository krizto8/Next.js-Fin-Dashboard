import { createSlice } from '@reduxjs/toolkit';

// Default API configurations
const defaultApiConfigs = {
  alphavantage: {
    name: 'Alpha Vantage',
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: '',
    enabled: false,
    endpoints: {
      quote: '?function=GLOBAL_QUOTE&symbol={symbol}&apikey={apiKey}',
      search: '?function=SYMBOL_SEARCH&keywords={symbol}&apikey={apiKey}',
      intraday: '?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={apiKey}',
      daily: '?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={apiKey}'
    }
  },
  finnhub: {
    name: 'Finnhub',
    baseUrl: 'https://finnhub.io/api/v1',
    apiKey: '',
    enabled: false,
    endpoints: {
      quote: '/quote?symbol={symbol}&token={apiKey}',
      search: '/search?q={symbol}&token={apiKey}',
      candles: '/stock/candle?symbol={symbol}&resolution=D&from={from}&to={to}&token={apiKey}'
    }
  }
};

// Load saved API configs from localStorage
const loadApiConfigs = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('apiConfigs');
      if (saved) {
        return { ...defaultApiConfigs, ...JSON.parse(saved) };
      }
    } catch (err) {
      console.warn('Error loading API configs:', err);
    }
  }
  return defaultApiConfigs;
};

// Save API configs to localStorage
const saveApiConfigs = (configs) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('apiConfigs', JSON.stringify(configs));
    } catch (err) {
      console.warn('Error saving API configs:', err);
    }
  }
};

const initialState = {
  configs: loadApiConfigs(),
  activeProvider: 'alphavantage',
  isConfigModalOpen: false,
  apiCallsCount: 0,
  lastApiCall: null
};

const apiConfigSlice = createSlice({
  name: 'apiConfig',
  initialState,
  reducers: {
    updateApiConfig: (state, action) => {
      const { provider, config } = action.payload;
      state.configs[provider] = { ...state.configs[provider], ...config };
      saveApiConfigs(state.configs);
    },

    setActiveProvider: (state, action) => {
      state.activeProvider = action.payload;
    },

    toggleApiProvider: (state, action) => {
      const provider = action.payload;
      state.configs[provider].enabled = !state.configs[provider].enabled;
      saveApiConfigs(state.configs);
    },

    openConfigModal: (state) => {
      state.isConfigModalOpen = true;
    },

    closeConfigModal: (state) => {
      state.isConfigModalOpen = false;
    },

    resetApiConfig: (state, action) => {
      const provider = action.payload;
      state.configs[provider] = { ...defaultApiConfigs[provider] };
      saveApiConfigs(state.configs);
    },

    addCustomApiProvider: (state, action) => {
      const { id, config } = action.payload;
      state.configs[id] = config;
      saveApiConfigs(state.configs);
    },

    incrementApiCalls: (state) => {
      state.apiCallsCount += 1;
      state.lastApiCall = Date.now();
    }
  }
});

export const {
  updateApiConfig,
  setActiveProvider,
  toggleApiProvider,
  openConfigModal,
  closeConfigModal,
  resetApiConfig,
  addCustomApiProvider,
  incrementApiCalls
} = apiConfigSlice.actions;

export default apiConfigSlice.reducer;

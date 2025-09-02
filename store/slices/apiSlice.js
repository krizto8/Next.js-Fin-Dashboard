import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cache management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (endpoint, params) => {
  return `${endpoint}_${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// API Rate limiting
const apiCallQueue = [];
let isProcessingQueue = false;
const RATE_LIMIT_DELAY = 12000; // 12 seconds between calls (5 calls per minute limit)

const processApiQueue = async () => {
  if (isProcessingQueue || apiCallQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (apiCallQueue.length > 0) {
    const { resolve, reject, apiCall } = apiCallQueue.shift();
    
    try {
      const result = await apiCall();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    
    // Wait before processing next call
    if (apiCallQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }
  
  isProcessingQueue = false;
};

const queueApiCall = (apiCall) => {
  return new Promise((resolve, reject) => {
    apiCallQueue.push({ resolve, reject, apiCall });
    processApiQueue();
  });
};

// Async thunks for API calls
export const fetchStockData = createAsyncThunk(
  'api/fetchStockData',
  async ({ symbol, interval = 'daily' }, { rejectWithValue }) => {
    const cacheKey = getCacheKey('stock_data', { symbol, interval });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const apiCall = async () => {
        const functionMap = {
          'daily': 'TIME_SERIES_DAILY',
          'weekly': 'TIME_SERIES_WEEKLY',
          'monthly': 'TIME_SERIES_MONTHLY',
          'intraday': 'TIME_SERIES_INTRADAY',
        };

        const apiFunction = functionMap[interval] || 'TIME_SERIES_DAILY';
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}?function=${apiFunction}&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`;
        
        if (interval === 'intraday') {
          url += '&interval=5min';
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Error Message']) {
          throw new Error(data['Error Message']);
        }
        
        if (data['Note']) {
          throw new Error('API call frequency limit reached. Please try again later.');
        }
        
        setCachedData(cacheKey, data);
        return data;
      };

      return await queueApiCall(apiCall);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuoteData = createAsyncThunk(
  'api/fetchQuoteData',
  async ({ symbol }, { rejectWithValue }) => {
    const cacheKey = getCacheKey('quote_data', { symbol });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const apiCall = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Error Message']) {
          throw new Error(data['Error Message']);
        }
        
        if (data['Note']) {
          throw new Error('API call frequency limit reached. Please try again later.');
        }
        
        setCachedData(cacheKey, data);
        return data;
      };

      return await queueApiCall(apiCall);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopGainersLosers = createAsyncThunk(
  'api/fetchTopGainersLosers',
  async (_, { rejectWithValue }) => {
    const cacheKey = getCacheKey('top_gainers_losers', {});
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const apiCall = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Error Message']) {
          throw new Error(data['Error Message']);
        }
        
        if (data['Note']) {
          throw new Error('API call frequency limit reached. Please try again later.');
        }
        
        setCachedData(cacheKey, data);
        return data;
      };

      return await queueApiCall(apiCall);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSymbols = createAsyncThunk(
  'api/searchSymbols',
  async ({ keywords }, { rejectWithValue }) => {
    const cacheKey = getCacheKey('search_symbols', { keywords });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const apiCall = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Error Message']) {
          throw new Error(data['Error Message']);
        }
        
        if (data['Note']) {
          throw new Error('API call frequency limit reached. Please try again later.');
        }
        
        setCachedData(cacheKey, data);
        return data;
      };

      return await queueApiCall(apiCall);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  stockData: {},
  quoteData: {},
  topGainersLosers: null,
  searchResults: [],
  lastApiCall: null,
  apiCallsCount: 0,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetApiState: (state) => {
      state.stockData = {};
      state.quoteData = {};
      state.topGainersLosers = null;
      state.searchResults = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stock data
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        const { symbol, interval } = action.meta.arg;
        const key = `${symbol}_${interval}`;
        state.stockData[key] = action.payload;
        state.lastApiCall = Date.now();
        state.apiCallsCount += 1;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Quote data
      .addCase(fetchQuoteData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuoteData.fulfilled, (state, action) => {
        state.loading = false;
        const { symbol } = action.meta.arg;
        state.quoteData[symbol] = action.payload;
        state.lastApiCall = Date.now();
        state.apiCallsCount += 1;
      })
      .addCase(fetchQuoteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Top gainers/losers
      .addCase(fetchTopGainersLosers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopGainersLosers.fulfilled, (state, action) => {
        state.loading = false;
        state.topGainersLosers = action.payload;
        state.lastApiCall = Date.now();
        state.apiCallsCount += 1;
      })
      .addCase(fetchTopGainersLosers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search symbols
      .addCase(searchSymbols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSymbols.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.bestMatches || [];
        state.lastApiCall = Date.now();
        state.apiCallsCount += 1;
      })
      .addCase(searchSymbols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSearchResults, resetApiState } = apiSlice.actions;

export default apiSlice.reducer;

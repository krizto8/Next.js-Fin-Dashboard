import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setWidgetLoading, 
  updateWidgetData 
} from '../store/slices/dashboardSlice';
import {
  fetchStockData,
  fetchQuoteData,
  fetchTopGainersLosers,
  searchSymbols
} from '../store/slices/apiSlice';

export function useWidgetRefresh() {
  const dispatch = useDispatch();
  const { widgets } = useSelector((state) => state.dashboard);
  const intervalsRef = useRef({});

  // Fetch data from Finnhub API
  const fetchFromFinnhub = async (widget) => {
    const { symbol, interval, cardType, tableType } = widget.config;
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    
    if (!apiKey) {
      throw new Error('Finnhub API key not configured');
    }

    try {
      let url = '';
      
      switch (widget.type) {
        case 'card':
          // Get quote data - available on free tier
          url = `https://finnhub.io/api/v1/quote?symbol=${symbol || 'AAPL'}&token=${apiKey}`;
          break;
        case 'chart':
          // For free tier, use quote data instead of historical candles
          // Historical candle data requires premium subscription
          url = `https://finnhub.io/api/v1/quote?symbol=${symbol || 'AAPL'}&token=${apiKey}`;
          break;
        case 'table':
          if (tableType === 'search') {
            // Symbol search - available on free tier
            url = `https://finnhub.io/api/v1/search?q=${symbol || 'AAPL'}&token=${apiKey}`;
          } else {
            // Default to quote for table
            url = `https://finnhub.io/api/v1/quote?symbol=${symbol || 'AAPL'}&token=${apiKey}`;
          }
          break;
        default:
          url = `https://finnhub.io/api/v1/quote?symbol=${symbol || 'AAPL'}&token=${apiKey}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Check if Finnhub returned an error in the response
      if (data.error) {
        throw new Error(`Finnhub API error: ${data.error}`);
      }
      
      // Transform Finnhub data to Alpha Vantage-like format
      return transformFinnhubData(data, widget.type, symbol);
      
    } catch (error) {
      // Provide helpful error messages for common Finnhub issues
      let errorMessage = error.message;
      if (error.message.includes('403') || error.message.includes("You don't have access")) {
        errorMessage = 'Finnhub API: This endpoint requires a premium subscription. Try switching to Alpha Vantage or upgrade your Finnhub plan.';
      }
      throw new Error(`Finnhub error: ${errorMessage}`);
    }
  };

  // Transform Finnhub response to Alpha Vantage format
  const transformFinnhubData = (data, widgetType, symbol) => {
    switch (widgetType) {
      case 'card':
        if (data.c !== undefined) {
          return {
            'Global Quote': {
              '01. symbol': symbol || 'N/A',
              '05. price': data.c?.toString() || '0',
              '09. change': (data.c - data.pc)?.toString() || '0',
              '10. change percent': (((data.c - data.pc) / data.pc) * 100)?.toFixed(2) + '%' || '0%',
              '02. open': data.o?.toString() || '0',
              '03. high': data.h?.toString() || '0',
              '04. low': data.l?.toString() || '0',
              '08. previous close': data.pc?.toString() || '0',
              '07. latest trading day': new Date().toISOString().split('T')[0]
            }
          };
        }
        break;
      case 'chart':
        if (data.c && data.t && Array.isArray(data.t)) {
          // Historical candle data (premium only)
          const timeSeries = {};
          data.t.forEach((timestamp, index) => {
            const date = new Date(timestamp * 1000).toISOString().split('T')[0];
            timeSeries[date] = {
              '1. open': data.o[index]?.toString() || '0',
              '2. high': data.h[index]?.toString() || '0',
              '3. low': data.l[index]?.toString() || '0',
              '4. close': data.c[index]?.toString() || '0',
              '5. volume': data.v[index]?.toString() || '0'
            };
          });
          return {
            'Meta Data': {
              '2. Symbol': symbol || 'N/A',
              '3. Last Refreshed': new Date().toISOString().split('T')[0]
            },
            'Time Series (Daily)': timeSeries
          };
        } else if (data.c) {
          // Quote data (free tier) - create a single data point for today
          const today = new Date().toISOString().split('T')[0];
          const timeSeries = {
            [today]: {
              '1. open': data.o?.toString() || '0',
              '2. high': data.h?.toString() || '0',
              '3. low': data.l?.toString() || '0',
              '4. close': data.c?.toString() || '0',
              '5. volume': '0' // Volume not available in quote endpoint
            }
          };
          return {
            'Meta Data': {
              '2. Symbol': symbol || 'N/A',
              '3. Last Refreshed': today
            },
            'Time Series (Daily)': timeSeries
          };
        }
        break;
      case 'table':
        if (data.result) {
          // Search results
          return {
            bestMatches: data.result.map(item => ({
              '1. symbol': item.symbol,
              '2. name': item.description,
              '3. type': item.type,
              '4. region': 'US',
              '5. marketOpen': '09:30',
              '6. marketClose': '16:00',
              '7. timezone': 'UTC-04',
              '8. currency': 'USD',
              '9. matchScore': '1.0000'
            }))
          };
        } else if (data.c !== undefined) {
          // Quote data for table
          return {
            'Global Quote': {
              '01. symbol': symbol || 'N/A',
              '05. price': data.c?.toString() || '0',
              '09. change': (data.c - data.pc)?.toString() || '0',
              '10. change percent': (((data.c - data.pc) / data.pc) * 100)?.toFixed(2) + '%' || '0%'
            }
          };
        }
        break;
    }
    return data;
  };

  const fetchWidgetData = async (widget) => {
    dispatch(setWidgetLoading({ id: widget.id, loading: true }));

    try {
      let result = null;
      const { symbol, interval, cardType, tableType, apiProvider } = widget.config;

      // Check if Finnhub is selected as API provider
      if (apiProvider === 'finnhub') {
        result = await fetchFromFinnhub(widget);
      } else {
        // Use default Alpha Vantage API
        switch (widget.type) {
          case 'chart':
            result = await dispatch(fetchStockData({ 
              symbol: symbol || 'AAPL', 
              interval: interval || 'daily' 
            })).unwrap();
            break;

          case 'card':
            if (cardType === 'gainers' || cardType === 'losers' || cardType === 'active') {
              result = await dispatch(fetchTopGainersLosers()).unwrap();
            } else {
              // Default to quote for single stock
              result = await dispatch(fetchQuoteData({ 
                symbol: symbol || 'AAPL' 
              })).unwrap();
            }
            break;

          case 'table':
            if (tableType === 'search') {
              result = await dispatch(searchSymbols({ 
                keywords: symbol || 'AAPL' 
              })).unwrap();
            } else if (tableType === 'gainers_losers') {
              result = await dispatch(fetchTopGainersLosers()).unwrap();
            } else if (tableType === 'timeseries') {
              result = await dispatch(fetchStockData({ 
                symbol: symbol || 'AAPL', 
                interval: interval || 'daily' 
              })).unwrap();
            } else {
              // Default to quote
              result = await dispatch(fetchQuoteData({ 
                symbol: symbol || 'AAPL' 
              })).unwrap();
            }
            break;

          default:
            result = await dispatch(fetchQuoteData({ 
              symbol: symbol || 'AAPL' 
            })).unwrap();
        }
      }

      dispatch(updateWidgetData({ 
        id: widget.id, 
        data: result, 
        error: null 
      }));
    } catch (error) {
      console.error(`Error fetching data for widget ${widget.id}:`, error);
      dispatch(updateWidgetData({ 
        id: widget.id, 
        data: null, 
        error: error.message || 'Failed to fetch data' 
      }));
    }
  };

  const startWidgetRefresh = (widget) => {
    // Clear existing interval if any
    if (intervalsRef.current[widget.id]) {
      clearInterval(intervalsRef.current[widget.id]);
    }

    // Fetch data immediately
    fetchWidgetData(widget);

    // Set up interval for auto-refresh
    const refreshInterval = widget.config.refreshInterval || 30000;
    intervalsRef.current[widget.id] = setInterval(() => {
      fetchWidgetData(widget);
    }, refreshInterval);
  };

  const stopWidgetRefresh = (widgetId) => {
    if (intervalsRef.current[widgetId]) {
      clearInterval(intervalsRef.current[widgetId]);
      delete intervalsRef.current[widgetId];
    }
  };

  const refreshWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      fetchWidgetData(widget);
    }
  };

  const refreshAllWidgets = () => {
    widgets.forEach(widget => {
      fetchWidgetData(widget);
    });
  };

  // Set up refresh intervals for all widgets
  useEffect(() => {
    widgets.forEach(widget => {
      startWidgetRefresh(widget);
    });

    return () => {
      // Clean up all intervals
      Object.values(intervalsRef.current).forEach(clearInterval);
      intervalsRef.current = {};
    };
  }, [widgets.length]); // Only re-run when number of widgets changes

  // Update intervals when widget configs change
  useEffect(() => {
    widgets.forEach(widget => {
      const currentInterval = intervalsRef.current[widget.id];
      const expectedInterval = widget.config.refreshInterval || 30000;
      
      // Check if interval needs to be updated
      if (currentInterval && currentInterval._idleTimeout !== expectedInterval) {
        startWidgetRefresh(widget);
      }
    });
  }, [widgets.map(w => w.config.refreshInterval).join(',')]);

  // Listen for custom refresh events
  useEffect(() => {
    const handleRefreshWidget = (event) => {
      const { widgetId } = event.detail;
      refreshWidget(widgetId);
    };

    const handleRefreshAll = () => {
      refreshAllWidgets();
    };

    window.addEventListener('refresh-widget', handleRefreshWidget);
    window.addEventListener('refresh-all-widgets', handleRefreshAll);

    return () => {
      window.removeEventListener('refresh-widget', handleRefreshWidget);
      window.removeEventListener('refresh-all-widgets', handleRefreshAll);
    };
  }, [widgets]);

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  return {
    refreshWidget,
    refreshAllWidgets,
    fetchWidgetData,
  };
}

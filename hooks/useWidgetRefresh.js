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

  const fetchWidgetData = async (widget) => {
    dispatch(setWidgetLoading({ id: widget.id, loading: true }));

    try {
      let result = null;
      const { symbol, interval, cardType, tableType } = widget.config;

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

import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Load dashboard state from localStorage
const loadDashboardState = () => {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = localStorage.getItem('dashboard');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  }
  return undefined;
};

// Save dashboard state to localStorage
const saveDashboardState = (state) => {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('dashboard', serializedState);
    } catch (err) {
      // Ignore write errors
    }
  }
};

const initialState = loadDashboardState() || {
  widgets: [],
  layout: [],
  selectedWidget: null,
  isAddingWidget: false,
  refreshInterval: 30000, // 30 seconds
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const { type, config } = action.payload;
      const widgetId = uuidv4();
      
      const newWidget = {
        id: widgetId,
        type,
        title: config.title || `${type} Widget`,
        config: {
          ...config,
          apiEndpoint: config.apiEndpoint || '',
          symbol: config.symbol || 'AAPL',
          refreshInterval: config.refreshInterval || 30000,
          displayFields: config.displayFields || [],
        },
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      };

      state.widgets.push(newWidget);
      
      // Add to layout
      const newLayoutItem = {
        i: widgetId,
        x: (state.layout.length * 2) % 12,
        y: Infinity,
        w: getDefaultWidth(type),
        h: getDefaultHeight(type),
        minW: 2,
        minH: 2,
      };
      
      state.layout.push(newLayoutItem);
      saveDashboardState(state);
    },

    removeWidget: (state, action) => {
      const widgetId = action.payload;
      state.widgets = state.widgets.filter(widget => widget.id !== widgetId);
      state.layout = state.layout.filter(item => item.i !== widgetId);
      
      if (state.selectedWidget === widgetId) {
        state.selectedWidget = null;
      }
      
      saveDashboardState(state);
    },

    updateWidget: (state, action) => {
      const { id, updates } = action.payload;
      const widget = state.widgets.find(w => w.id === id);
      if (widget) {
        Object.assign(widget, updates);
        saveDashboardState(state);
      }
    },

    updateWidgetConfig: (state, action) => {
      const { id, config } = action.payload;
      const widget = state.widgets.find(w => w.id === id);
      if (widget) {
        widget.config = { ...widget.config, ...config };
        saveDashboardState(state);
      }
    },

    updateWidgetData: (state, action) => {
      const { id, data, error } = action.payload;
      const widget = state.widgets.find(w => w.id === id);
      if (widget) {
        widget.data = data;
        widget.error = error;
        widget.loading = false;
        widget.lastUpdated = new Date().toISOString();
        saveDashboardState(state);
      }
    },

    setWidgetLoading: (state, action) => {
      const { id, loading } = action.payload;
      const widget = state.widgets.find(w => w.id === id);
      if (widget) {
        widget.loading = loading;
        if (loading) {
          widget.error = null;
        }
      }
    },

    updateLayout: (state, action) => {
      state.layout = action.payload;
      saveDashboardState(state);
    },

    selectWidget: (state, action) => {
      state.selectedWidget = action.payload;
    },

    setAddingWidget: (state, action) => {
      state.isAddingWidget = action.payload;
    },

    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
      saveDashboardState(state);
    },

    importDashboard: (state, action) => {
      const importedState = action.payload;
      state.widgets = importedState.widgets || [];
      state.layout = importedState.layout || [];
      state.refreshInterval = importedState.refreshInterval || 30000;
      saveDashboardState(state);
    },

    clearDashboard: (state) => {
      state.widgets = [];
      state.layout = [];
      state.selectedWidget = null;
      saveDashboardState(state);
    },

    setWidgets: (state, action) => {
      state.widgets = action.payload;
      saveDashboardState(state);
    },

    setLayout: (state, action) => {
      state.layout = action.payload;
      saveDashboardState(state);
    },

    applyTemplate: (state, action) => {
      const { widgets, layout } = action.payload;
      state.widgets = widgets;
      state.layout = layout;
      state.selectedWidget = null;
      saveDashboardState(state);
    },
  },
});

// Helper functions
const getDefaultWidth = (type) => {
  switch (type) {
    case 'table':
      return 8;
    case 'chart':
      return 6;
    case 'card':
      return 4;
    default:
      return 4;
  }
};

const getDefaultHeight = (type) => {
  switch (type) {
    case 'table':
      return 6;
    case 'chart':
      return 4;
    case 'card':
      return 3;
    default:
      return 3;
  }
};

export const {
  addWidget,
  removeWidget,
  updateWidget,
  updateWidgetConfig,
  updateWidgetData,
  setWidgetLoading,
  updateLayout,
  selectWidget,
  setAddingWidget,
  setRefreshInterval,
  importDashboard,
  clearDashboard,
  setWidgets,
  setLayout,
  applyTemplate,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

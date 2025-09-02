// Dashboard template configurations
export const dashboardTemplates = {
  basic: {
    id: 'basic',
    name: 'Basic Portfolio',
    description: 'Simple stock tracking with essential metrics',
    category: 'Beginner',
    widgets: [
      {
        type: 'card',
        title: 'AAPL Stock Card',
        config: {
          symbol: 'AAPL',
          cardType: 'quote',
          apiProvider: 'alphavantage',
          refreshInterval: 30000,
          displayFields: ['01. symbol', '05. price', '09. change', '10. change percent'],
          fieldFormats: {
            '05. price': 'currency-usd',
            '09. change': 'currency-usd',
            '10. change percent': 'percentage-sign'
          }
        },
        layout: { x: 0, y: 0, w: 4, h: 4 }
      },
      {
        type: 'card',
        title: 'GOOGL Stock Card',
        config: {
          symbol: 'GOOGL',
          cardType: 'quote',
          apiProvider: 'alphavantage',
          refreshInterval: 30000,
          displayFields: ['01. symbol', '05. price', '09. change', '10. change percent'],
          fieldFormats: {
            '05. price': 'currency-usd',
            '09. change': 'currency-usd',
            '10. change percent': 'percentage-sign'
          }
        },
        layout: { x: 4, y: 0, w: 4, h: 4 }
      },
      {
        type: 'chart',
        title: 'AAPL Price Chart',
        config: {
          symbol: 'AAPL',
          interval: 'daily',
          chartType: 'line',
          apiProvider: 'alphavantage',
          refreshInterval: 300000
        },
        layout: { x: 8, y: 0, w: 4, h: 6 }
      }
    ]
  },

  comprehensive: {
    id: 'comprehensive',
    name: 'Comprehensive Analysis',
    description: 'Complete market overview with multiple data sources',
    category: 'Advanced',
    widgets: [
      {
        type: 'card',
        title: 'Market Leaders',
        config: {
          cardType: 'gainers',
          apiProvider: 'alphavantage',
          refreshInterval: 60000,
          displayFields: ['ticker', 'price', 'change_amount', 'change_percentage'],
          fieldFormats: {
            'price': 'currency-usd',
            'change_amount': 'currency-usd',
            'change_percentage': 'percentage-sign'
          }
        },
        layout: { x: 0, y: 0, w: 3, h: 4 }
      },
      {
        type: 'card',
        title: 'Market Losers',
        config: {
          cardType: 'losers',
          apiProvider: 'alphavantage',
          refreshInterval: 60000,
          displayFields: ['ticker', 'price', 'change_amount', 'change_percentage'],
          fieldFormats: {
            'price': 'currency-usd',
            'change_amount': 'currency-usd',
            'change_percentage': 'percentage-sign'
          }
        },
        layout: { x: 3, y: 0, w: 3, h: 4 }
      },
      {
        type: 'card',
        title: 'Most Active',
        config: {
          cardType: 'active',
          apiProvider: 'alphavantage',
          refreshInterval: 60000,
          displayFields: ['ticker', 'price', 'volume'],
          fieldFormats: {
            'price': 'currency-usd',
            'volume': 'decimal-0'
          }
        },
        layout: { x: 6, y: 0, w: 3, h: 4 }
      },
      {
        type: 'chart',
        title: 'SPY ETF Tracking',
        config: {
          symbol: 'SPY',
          interval: 'daily',
          chartType: 'line',
          apiProvider: 'alphavantage',
          refreshInterval: 300000
        },
        layout: { x: 9, y: 0, w: 3, h: 6 }
      },
      {
        type: 'table',
        title: 'Portfolio Watchlist',
        config: {
          tableType: 'search',
          symbol: 'technology',
          apiProvider: 'alphavantage',
          refreshInterval: 300000,
          displayFields: ['1. symbol', '2. name', '3. type', '9. matchScore'],
          fieldFormats: {
            '9. matchScore': 'percentage-0'
          }
        },
        layout: { x: 0, y: 4, w: 6, h: 4 }
      },
      {
        type: 'chart',
        title: 'Tesla Performance',
        config: {
          symbol: 'TSLA',
          interval: 'weekly',
          chartType: 'candlestick',
          apiProvider: 'alphavantage',
          refreshInterval: 300000
        },
        layout: { x: 6, y: 4, w: 3, h: 4 }
      }
    ]
  },

  crypto: {
    id: 'crypto',
    name: 'Crypto Tracker',
    description: 'Cryptocurrency focused dashboard',
    category: 'Crypto',
    widgets: [
      {
        type: 'card',
        title: 'Bitcoin (BTC)',
        config: {
          symbol: 'BINANCE:BTCUSDT',
          cardType: 'quote',
          apiProvider: 'finnhub',
          refreshInterval: 15000,
          displayFields: ['c', 'h', 'l', 'o'],
          fieldFormats: {
            'c': 'currency-usd',
            'h': 'currency-usd',
            'l': 'currency-usd',
            'o': 'currency-usd'
          }
        },
        layout: { x: 0, y: 0, w: 3, h: 4 }
      },
      {
        type: 'card',
        title: 'Ethereum (ETH)',
        config: {
          symbol: 'BINANCE:ETHUSDT',
          cardType: 'quote',
          apiProvider: 'finnhub',
          refreshInterval: 15000,
          displayFields: ['c', 'h', 'l', 'o'],
          fieldFormats: {
            'c': 'currency-usd',
            'h': 'currency-usd',
            'l': 'currency-usd',
            'o': 'currency-usd'
          }
        },
        layout: { x: 3, y: 0, w: 3, h: 4 }
      },
      {
        type: 'chart',
        title: 'Bitcoin Price Chart',
        config: {
          symbol: 'BINANCE:BTCUSDT',
          interval: 'daily',
          chartType: 'line',
          apiProvider: 'finnhub',
          refreshInterval: 60000
        },
        layout: { x: 6, y: 0, w: 6, h: 6 }
      },
      {
        type: 'table',
        title: 'Crypto Search',
        config: {
          tableType: 'search',
          symbol: 'crypto',
          apiProvider: 'finnhub',
          refreshInterval: 300000,
          displayFields: ['symbol', 'description', 'type'],
          fieldFormats: {}
        },
        layout: { x: 0, y: 4, w: 6, h: 4 }
      }
    ]
  },

  dayTrader: {
    id: 'dayTrader',
    name: 'Day Trader Setup',
    description: 'Real-time monitoring for active trading',
    category: 'Trading',
    widgets: [
      {
        type: 'card',
        title: 'SPY Quick View',
        config: {
          symbol: 'SPY',
          cardType: 'quote',
          apiProvider: 'finnhub',
          refreshInterval: 15000,
          displayFields: ['c', 'h', 'l', 'pc'],
          fieldFormats: {
            'c': 'currency-usd',
            'h': 'currency-usd',
            'l': 'currency-usd',
            'pc': 'currency-usd'
          }
        },
        layout: { x: 0, y: 0, w: 2, h: 3 }
      },
      {
        type: 'card',
        title: 'QQQ Tech Tracker',
        config: {
          symbol: 'QQQ',
          cardType: 'quote',
          apiProvider: 'finnhub',
          refreshInterval: 15000,
          displayFields: ['c', 'h', 'l', 'pc'],
          fieldFormats: {
            'c': 'currency-usd',
            'h': 'currency-usd',
            'l': 'currency-usd',
            'pc': 'currency-usd'
          }
        },
        layout: { x: 2, y: 0, w: 2, h: 3 }
      },
      {
        type: 'chart',
        title: 'SPY Intraday',
        config: {
          symbol: 'SPY',
          interval: 'intraday',
          chartType: 'line',
          apiProvider: 'alphavantage',
          refreshInterval: 60000
        },
        layout: { x: 4, y: 0, w: 4, h: 4 }
      },
      {
        type: 'chart',
        title: 'QQQ Intraday',
        config: {
          symbol: 'QQQ',
          interval: 'intraday',
          chartType: 'line',
          apiProvider: 'alphavantage',
          refreshInterval: 60000
        },
        layout: { x: 8, y: 0, w: 4, h: 4 }
      },
      {
        type: 'card',
        title: 'Market Movers',
        config: {
          cardType: 'active',
          apiProvider: 'alphavantage',
          refreshInterval: 30000,
          displayFields: ['ticker', 'price', 'volume'],
          fieldFormats: {
            'price': 'currency-usd',
            'volume': 'currency-compact'
          }
        },
        layout: { x: 0, y: 3, w: 4, h: 3 }
      },
      {
        type: 'table',
        title: 'Watchlist',
        config: {
          tableType: 'quote',
          symbol: 'AAPL',
          apiProvider: 'alphavantage',
          refreshInterval: 30000,
          displayFields: ['01. symbol', '05. price', '09. change', '06. volume'],
          fieldFormats: {
            '05. price': 'currency-usd',
            '09. change': 'currency-usd',
            '06. volume': 'decimal-0'
          }
        },
        layout: { x: 4, y: 4, w: 8, h: 4 }
      }
    ]
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal Portfolio',
    description: 'Clean and simple portfolio overview',
    category: 'Beginner',
    widgets: [
      {
        type: 'card',
        title: 'Portfolio Value',
        config: {
          symbol: 'VTI',
          cardType: 'quote',
          apiProvider: 'alphavantage',
          refreshInterval: 60000,
          displayFields: ['01. symbol', '05. price', '10. change percent'],
          fieldFormats: {
            '05. price': 'currency-usd',
            '10. change percent': 'percentage-sign'
          }
        },
        layout: { x: 0, y: 0, w: 6, h: 4 }
      },
      {
        type: 'chart',
        title: 'Market Trend',
        config: {
          symbol: 'VTI',
          interval: 'weekly',
          chartType: 'line',
          apiProvider: 'alphavantage',
          refreshInterval: 300000
        },
        layout: { x: 6, y: 0, w: 6, h: 6 }
      },
      {
        type: 'table',
        title: 'Holdings',
        config: {
          tableType: 'search',
          symbol: 'ETF',
          apiProvider: 'alphavantage',
          refreshInterval: 300000,
          displayFields: ['1. symbol', '2. name', '9. matchScore'],
          fieldFormats: {
            '9. matchScore': 'percentage-0'
          }
        },
        layout: { x: 0, y: 4, w: 6, h: 4 }
      }
    ]
  }
};

// Template categories for organization
export const templateCategories = {
  'Beginner': {
    icon: '🌱',
    description: 'Simple setups for getting started',
    color: 'green'
  },
  'Advanced': {
    icon: '📊',
    description: 'Comprehensive analysis tools',
    color: 'blue'
  },
  'Trading': {
    icon: '⚡',
    description: 'Real-time trading focused',
    color: 'orange'
  },
  'Crypto': {
    icon: '₿',
    description: 'Cryptocurrency tracking',
    color: 'yellow'
  }
};

// Helper function to apply a template
export const applyDashboardTemplate = (template) => {
  const widgets = template.widgets.map(widget => ({
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: widget.type,
    title: widget.title,
    config: {
      ...widget.config,
      displayFields: widget.config.displayFields || [],
      fieldFormats: widget.config.fieldFormats || {}
    },
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  }));

  const layout = template.widgets.map((widget, index) => ({
    i: widgets[index].id,
    x: widget.layout.x,
    y: widget.layout.y,
    w: widget.layout.w,
    h: widget.layout.h,
    minW: 2,
    minH: 2
  }));

  return { widgets, layout };
};

// Get template by ID
export const getTemplate = (templateId) => {
  return dashboardTemplates[templateId] || null;
};

// Get all templates by category
export const getTemplatesByCategory = (category) => {
  return Object.values(dashboardTemplates).filter(template => template.category === category);
};

// Get all template categories
export const getAllCategories = () => {
  return Object.keys(templateCategories);
};

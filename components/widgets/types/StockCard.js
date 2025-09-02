import { useMemo } from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiDollarSign, FiBarChart } from 'react-icons/fi';
import { formatFieldValue, getFieldValue, getFieldDisplayName } from '../../../utils/fieldFormatting';

export default function StockCard({ widget }) {
  const cardData = useMemo(() => {
    // First check if widget has an error (from useWidgetRefresh)
    if (widget.error) {
      const provider = widget.config?.apiProvider || 'alphavantage';
      return {
        type: 'error',
        message: widget.error,
        provider: provider
      };
    }

    if (!widget.data) {
      return null;
    }

    // Check for API rate limit or error messages from different providers
    if (widget.data['Information']) {
      return {
        type: 'error',
        message: widget.data['Information'],
        provider: 'alphavantage'
      };
    }

    if (widget.data['Error Message']) {
      return {
        type: 'error',
        message: widget.data['Error Message'],
        provider: 'alphavantage'
      };
    }

    if (widget.data['Note']) {
      return {
        type: 'error',
        message: widget.data['Note'],
        provider: 'alphavantage'
      };
    }

    // Check for Finnhub specific errors
    if (widget.data['error']) {
      return {
        type: 'error',
        message: widget.data['error'],
        provider: 'finnhub'
      };
    }

    // Handle different types of API responses
    if (widget.data['Global Quote']) {
      // Single stock quote
      const quote = widget.data['Global Quote'];
      return {
        type: 'quote',
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'],
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        volume: parseInt(quote['06. volume']),
        previousClose: parseFloat(quote['08. previous close']),
        latestTradingDay: quote['07. latest trading day'],
      };
    } else if (widget.data.top_gainers || widget.data.top_losers || widget.data.most_actively_traded) {
      // Top gainers/losers data
      const config = widget.config.cardType || 'gainers';
      let data = [];
      
      if (config === 'gainers' && widget.data.top_gainers) {
        data = widget.data.top_gainers.slice(0, 5);
      } else if (config === 'losers' && widget.data.top_losers) {
        data = widget.data.top_losers.slice(0, 5);
      } else if (config === 'active' && widget.data.most_actively_traded) {
        data = widget.data.most_actively_traded.slice(0, 5);
      }

      return {
        type: 'list',
        category: config,
        data: data.map(item => ({
          symbol: item.ticker,
          price: parseFloat(item.price),
          change: parseFloat(item.change_amount),
          changePercent: item.change_percentage,
          volume: parseInt(item.volume),
        }))
      };
    } else if (widget.data['Time Series (Daily)']) {
      // Time series data - show latest day info
      const timeSeries = widget.data['Time Series (Daily)'];
      const latestDate = Object.keys(timeSeries)[0];
      const latestData = timeSeries[latestDate];
      const previousDate = Object.keys(timeSeries)[1];
      const previousData = timeSeries[previousDate];
      
      const currentClose = parseFloat(latestData['4. close']);
      const previousClose = parseFloat(previousData['4. close']);
      const change = currentClose - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2);

      return {
        type: 'timeseries',
        symbol: widget.data['Meta Data']['2. Symbol'],
        date: latestDate,
        price: currentClose,
        change: change,
        changePercent: `${changePercent}%`,
        open: parseFloat(latestData['1. open']),
        high: parseFloat(latestData['2. high']),
        low: parseFloat(latestData['3. low']),
        volume: parseInt(latestData['5. volume']),
      };
    }

    return null;
  }, [widget.data, widget.config.cardType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  };

  const renderErrorCard = (data) => {
    // Determine the provider with better detection
    let provider = data.provider || widget.config?.apiProvider || 'alphavantage';
    
    // Auto-detect provider from error message if not explicitly set
    if (data.message.includes('Finnhub')) {
      provider = 'finnhub';
    } else if (data.message.includes('Alpha Vantage') || data.message.includes('alphavantage')) {
      provider = 'alphavantage';
    }
    
    // Get provider-specific information
    const getProviderInfo = (provider) => {
      switch (provider) {
        case 'finnhub':
          return {
            name: 'Finnhub',
            freeTier: '60 calls/minute (Free)',
            premium: 'Higher rate limits + Premium features',
            upgradeText: 'This feature requires a Finnhub premium subscription.',
            switchText: 'Try switching to Alpha Vantage in widget settings'
          };
        case 'alphavantage':
        default:
          return {
            name: 'Alpha Vantage',
            freeTier: '25 requests/day (Free)',
            premium: 'Unlimited requests (Premium)',
            upgradeText: 'Daily API limit reached. Please try again later.',
            switchText: 'Try switching to Finnhub in widget settings'
          };
      }
    };

    const providerInfo = getProviderInfo(provider);
    
    // Determine if it's a rate limit error with better detection
    const isRateLimit = data.message.includes('rate limit') || 
                       data.message.includes('frequency limit') ||
                       data.message.includes('premium subscription') ||
                       data.message.includes("don't have access") ||
                       data.message.includes('API limit') ||
                       data.message.includes('403') ||
                       data.message.includes('limit reached');

    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {isRateLimit ? `${providerInfo.name} API Limit` : `${providerInfo.name} Error`}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {isRateLimit 
            ? providerInfo.upgradeText
            : data.message
          }
        </p>
        {isRateLimit && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <p>• Free tier: {providerInfo.freeTier}</p>
            <p>• Premium: {providerInfo.premium}</p>
            <p className="mt-2 text-blue-600 dark:text-blue-400">
              💡 {providerInfo.switchText}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render custom selected fields
  const renderCustomFields = (data) => {
    const displayFields = widget.config?.displayFields || [];
    const fieldFormats = widget.config?.fieldFormats || {};
    
    if (displayFields.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {displayFields.slice(0, 6).map((field) => {
          const rawValue = getFieldValue(data, field) ?? getFieldValue(widget.data, field);
          const formatType = fieldFormats[field] || 'default';
          
          // Determine field type
          let fieldType = 'string';
          if (typeof rawValue === 'number') fieldType = 'number';
          if (field.includes('date') || field.includes('time')) fieldType = 'date';
          if (field.includes('percent') || field.includes('%')) fieldType = 'percentage';
          if (field.includes('price') || field.includes('cost') || field.includes('value')) fieldType = 'currency';
          
          const formattedValue = formatFieldValue(rawValue, formatType, fieldType);
          
          return (
            <div key={field} className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {getFieldDisplayName(field)}
              </p>
              <p className={`text-sm font-medium mt-1 ${
                fieldType === 'currency' ? 'text-green-600 dark:text-green-400' :
                fieldType === 'percentage' ? 'text-blue-600 dark:text-blue-400' :
                'text-gray-900 dark:text-gray-100'
              }`}>
                {formattedValue}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderQuoteCard = (data) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.symbol}
          </h3>
          <FiDollarSign className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.latestTradingDay}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(data.price)}
        </div>
        <div className={`flex items-center mt-1 ${
          data.change >= 0 ? 'text-success-600' : 'text-danger-600'
        }`}>
          {data.change >= 0 ? (
            <FiTrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <FiTrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="font-medium">
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent})
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">High</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(data.high)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Low</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(data.low)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Open</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(data.open)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatVolume(data.volume)}</p>
        </div>
      </div>
      
      {/* Custom Fields */}
      {renderCustomFields(data)}
    </div>
  );

  const renderListCard = (data) => {
    const getIcon = () => {
      switch (data.category) {
        case 'gainers':
          return <FiTrendingUp className="h-6 w-6 text-success-600" />;
        case 'losers':
          return <FiTrendingDown className="h-6 w-6 text-danger-600" />;
        case 'active':
          return <FiActivity className="h-6 w-6 text-primary-600" />;
        default:
          return <FiBarChart className="h-6 w-6 text-gray-600" />;
      }
    };

    const getTitle = () => {
      switch (data.category) {
        case 'gainers':
          return 'Top Gainers';
        case 'losers':
          return 'Top Losers';
        case 'active':
          return 'Most Active';
        default:
          return 'Market Data';
      }
    };

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {getTitle()}
          </h3>
          {getIcon()}
        </div>

        {/* List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {data.data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {item.symbol}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  item.change >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </div>
                <div className={`text-sm ${
                  item.change >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {item.changePercent}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTimeSeriesCard = (data) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.symbol}
          </h3>
          <FiBarChart className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.date}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(data.price)}
        </div>
        <div className={`flex items-center mt-1 ${
          data.change >= 0 ? 'text-success-600' : 'text-danger-600'
        }`}>
          {data.change >= 0 ? (
            <FiTrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <FiTrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="font-medium">
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent})
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">High</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(data.high)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Low</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(data.low)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Open</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(data.open)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatVolume(data.volume)}</p>
        </div>
      </div>
    </div>
  );

  if (!cardData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <FiDollarSign className="mx-auto h-12 w-12 mb-4" />
          <p>No card data available</p>
          <p className="text-sm mt-1">Configure the widget to display financial data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {cardData.type === 'error' && renderErrorCard(cardData)}
      {cardData.type === 'quote' && renderQuoteCard(cardData)}
      {cardData.type === 'list' && renderListCard(cardData)}
      {cardData.type === 'timeseries' && renderTimeSeriesCard(cardData)}
    </div>
  );
}

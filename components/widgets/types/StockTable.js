import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StockTable({ widget }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 5;

  // Process the API data
  const processedData = useMemo(() => {
    if (!widget.data) return [];

    let data = [];
    
    if (widget.data.bestMatches) {
      // Search results data
      data = widget.data.bestMatches.map(item => ({
        symbol: item['1. symbol'],
        name: item['2. name'],
        type: item['3. type'],
        region: item['4. region'],
        marketOpen: item['5. marketOpen'],
        marketClose: item['6. marketClose'],
        timezone: item['7. timezone'],
        currency: item['8. currency'],
        matchScore: item['9. matchScore']
      }));
    } else if (widget.data['Global Quote']) {
      // Single quote data
      const quote = widget.data['Global Quote'];
      data = [{
        symbol: quote['01. symbol'],
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        price: parseFloat(quote['05. price']),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day'],
        previousClose: parseFloat(quote['08. previous close']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent']
      }];
    } else if (widget.data.top_gainers || widget.data.top_losers || widget.data.most_actively_traded) {
      // Top gainers/losers data
      data = [
        ...(widget.data.top_gainers || []),
        ...(widget.data.top_losers || []),
        ...(widget.data.most_actively_traded || [])
      ].map(item => ({
        symbol: item.ticker,
        price: parseFloat(item.price),
        change: parseFloat(item.change_amount),
        changePercent: item.change_percentage,
        volume: parseInt(item.volume)
      }));
    } else if (widget.data['Time Series (Daily)']) {
      // Time series data - convert to table format
      const timeSeries = widget.data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).slice(0, 10); // Last 10 days
      data = dates.map(date => {
        const dayData = timeSeries[date];
        return {
          date,
          open: parseFloat(dayData['1. open']),
          high: parseFloat(dayData['2. high']),
          low: parseFloat(dayData['3. low']),
          close: parseFloat(dayData['4. close']),
          volume: parseInt(dayData['5. volume'])
        };
      });
    }

    return data;
  }, [widget.data]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = processedData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort data
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [processedData, searchTerm, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatValue = (value, type = 'text') => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(value);
      case 'percentage':
        return value.toString().replace('%', '') + '%';
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      case 'change':
        const numValue = parseFloat(value);
        const isPositive = numValue >= 0;
        return (
          <span className={`flex items-center ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
            {isPositive ? <FiTrendingUp className="h-4 w-4 mr-1" /> : <FiTrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(numValue).toFixed(2)}
          </span>
        );
      default:
        return value;
    }
  };

  const renderTableHeaders = () => {
    if (processedData.length === 0) return null;

    const sampleItem = processedData[0];
    const fields = Object.keys(sampleItem);

    return (
      <tr className="bg-gray-50 dark:bg-gray-700">
        {fields.map(field => (
          <th
            key={field}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => handleSort(field)}
          >
            <div className="flex items-center space-x-1">
              <span>{field.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              {sortField === field && (
                <span className="text-primary-600">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return paginatedData.map((item, index) => (
      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        {Object.entries(item).map(([key, value]) => (
          <td key={key} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
            {key.includes('change') && typeof value === 'number' ? 
              formatValue(value, 'change') :
              key.includes('price') || key.includes('open') || key.includes('high') || key.includes('low') || key.includes('close') ?
              formatValue(value, 'currency') :
              key.includes('volume') ?
              formatValue(value, 'number') :
              key.includes('percent') ?
              formatValue(value, 'percentage') :
              formatValue(value)
            }
          </td>
        ))}
      </tr>
    ));
  };

  if (processedData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No data available for table display</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="sticky top-0">
            {renderTableHeaders()}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {renderTableRows()}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function StockChart({ widget }) {
  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    if (!widget.data) return null;

    let timeSeriesData = null;
    let metaData = null;

    // Extract time series data from different API responses
    if (widget.data['Time Series (Daily)']) {
      timeSeriesData = widget.data['Time Series (Daily)'];
      metaData = widget.data['Meta Data'];
    } else if (widget.data['Time Series (Weekly)']) {
      timeSeriesData = widget.data['Time Series (Weekly)'];
      metaData = widget.data['Meta Data'];
    } else if (widget.data['Time Series (Monthly)']) {
      timeSeriesData = widget.data['Time Series (Monthly)'];
      metaData = widget.data['Meta Data'];
    } else if (widget.data['Time Series (5min)']) {
      timeSeriesData = widget.data['Time Series (5min)'];
      metaData = widget.data['Meta Data'];
    }

    if (!timeSeriesData) return null;

    // Convert data to chart format
    const dates = Object.keys(timeSeriesData).reverse(); // Reverse to get chronological order
    const chartType = widget.config.chartType || 'line';

    const datasets = [];

    if (chartType === 'candlestick' || chartType === 'ohlc') {
      // For candlestick charts, we'll show OHLC as separate lines
      datasets.push(
        {
          label: 'Open',
          data: dates.map(date => ({
            x: date,
            y: parseFloat(timeSeriesData[date]['1. open'])
          })),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
        },
        {
          label: 'High',
          data: dates.map(date => ({
            x: date,
            y: parseFloat(timeSeriesData[date]['2. high'])
          })),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1,
        },
        {
          label: 'Low',
          data: dates.map(date => ({
            x: date,
            y: parseFloat(timeSeriesData[date]['3. low'])
          })),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1,
        },
        {
          label: 'Close',
          data: dates.map(date => ({
            x: date,
            y: parseFloat(timeSeriesData[date]['4. close'])
          })),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.1,
          borderWidth: 3,
        }
      );
    } else if (chartType === 'volume') {
      datasets.push({
        label: 'Volume',
        data: dates.map(date => ({
          x: date,
          y: parseInt(timeSeriesData[date]['5. volume'])
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        type: 'bar',
      });
    } else {
      // Default line chart showing close price
      datasets.push({
        label: 'Close Price',
        data: dates.map(date => ({
          x: date,
          y: parseFloat(timeSeriesData[date]['4. close'])
        })),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      });
    }

    return {
      datasets,
      metaData,
    };
  }, [widget.data, widget.config.chartType]);

  const options = useMemo(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#374151';
    const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              
              if (label === 'Volume') {
                return `${label}: ${new Intl.NumberFormat().format(value)}`;
              } else {
                return `${label}: $${value.toFixed(2)}`;
              }
            },
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              day: 'MMM dd',
              week: 'MMM dd',
              month: 'MMM yyyy'
            }
          },
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
            maxTicksLimit: 8,
          },
        },
        y: {
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
            callback: function(value) {
              if (widget.config.chartType === 'volume') {
                return new Intl.NumberFormat().format(value);
              }
              return '$' + value.toFixed(2);
            },
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
        },
      },
    };
  }, [widget.config.chartType]);

  // Update chart colors when theme changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, []);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No chart data available</p>
          <p className="text-sm mt-1">Configure the widget to display stock chart data</p>
        </div>
      </div>
    );
  }

  const ChartComponent = widget.config.chartType === 'volume' ? Bar : Line;

  return (
    <div className="h-full">
      {chartData.metaData && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">
              {chartData.metaData['2. Symbol']} - {chartData.metaData['1. Information']}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Last Refreshed: {chartData.metaData['3. Last Refreshed']}
            {chartData.metaData['5. Time Zone'] && ` (${chartData.metaData['5. Time Zone']})`}
          </div>
        </div>
      )}
      
      <div className="h-full min-h-0">
        <ChartComponent
          ref={chartRef}
          data={{ datasets: chartData.datasets }}
          options={options}
        />
      </div>
    </div>
  );
}

# Finance Dashboard

A customizable real-time finance monitoring dashboard built with Next.js and React.

## Features

- **Real-time Data**: Live stock market data from multiple API providers
- **User-Configurable APIs**: Set up API keys and providers through the UI
- **Multiple Data Sources**: Support for Alpha Vantage, Finnhub, and custom APIs
- **Customizable Widgets**: Add, remove, and configure various widget types
- **Interactive Charts**: Visualize stock data with Chart.js
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Toggle between dark and light modes
- **Drag & Drop**: Rearrange widgets with drag-and-drop functionality
- **Data Persistence**: Dashboard state saves automatically
- **Export/Import**: Backup and restore dashboard configurations
- **Dashboard Templates**: Pre-built layouts for different use cases

## Widget Types

1. **Stock Table**: Display stock data in searchable, sortable tables
2. **Stock Chart**: Interactive price charts with multiple timeframes
3. **Stock Card**: Compact cards showing key metrics and data

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- API keys from supported providers (configured through the UI)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fin_dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Configure API Providers**: 
   - Click the Settings (⚙️) icon in the header
   - Add your API keys for supported providers
   - Enable the providers you want to use
   - Test the connection to verify setup

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding Widgets

1. Click the "Add Widget" button in the header
2. Select a widget type (Table, Chart, or Card)
3. Configure the widget settings
4. Click "Add Widget" to add it to your dashboard

### Configuring Widgets

1. Click on a widget to select it
2. Click the settings icon in the widget header
3. Modify the configuration options
4. Save your changes

### Dashboard Management

- **Templates**: Choose from pre-built dashboard layouts
- **Rearrange**: Drag widgets to new positions
- **Resize**: Drag the corner of widgets to resize them
- **Export**: Download your dashboard configuration
- **Import**: Upload a previously saved configuration
- **Clear**: Remove all widgets from the dashboard
- **API Settings**: Configure multiple data providers

## API Configuration

The dashboard supports multiple financial data providers that you configure directly in the UI:

### Supported Providers

1. **Alpha Vantage** 
   - Free tier available with rate limits
   - Get your API key: [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
   - Provides: Stock quotes, time series, search, top gainers/losers

2. **Finnhub**
   - Free tier available with rate limits  
   - Get your API key: [https://finnhub.io/](https://finnhub.io/)
   - Provides: Real-time quotes, candle data, company profiles

3. **Custom API Providers**
   - Add your own API endpoints
   - Configure custom data transformations
   - Support for any REST API with proper configuration

### Setting Up API Keys

1. **Access Configuration**: Click the Settings (⚙️) icon in the header
2. **Select Provider**: Choose from Alpha Vantage, Finnhub, or add custom
3. **Enter API Key**: Paste your API key in the provided field
4. **Configure Endpoints**: Customize API endpoints if needed (advanced)
5. **Test Connection**: Use the test button to verify your setup
6. **Enable Provider**: Toggle the provider on to start using it

### API Features

- **Automatic Rate Limiting**: Respects API quotas and limits
- **Error Handling**: Graceful fallbacks and error messages
- **Caching**: Intelligent caching to reduce API calls
- **Multiple Providers**: Use different providers for different widgets
- **Real-time Stats**: Track API call counts and usage

## Customization

### Adding New Widget Types

1. Create a new component in `components/widgets/types/`
2. Add the widget type to the dashboard slice
3. Update the widget factory in the main widget component
4. Add configuration options in the modals

### Styling

The project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`.

### API Configuration

**No environment variables needed!** All API configuration is done through the UI:

1. Click the Settings (⚙️) button in the header
2. Add your API keys for supported providers
3. Configure endpoints and test connections
4. Enable/disable providers as needed
5. Settings are automatically saved in your browser

The dashboard handles multiple providers and automatically manages API calls, rate limiting, and error handling.

## Project Structure

```
fin_dashboard/
├── components/
│   ├── common/           # Shared components (templates, loading)
│   ├── layout/           # Layout components (header, sidebar)
│   ├── modals/           # Modal components (add widget, API config)
│   └── widgets/          # Widget components and types
├── hooks/                # Custom React hooks (widget refresh)
├── pages/                # Next.js pages
├── store/                # Redux store and slices
│   └── slices/           # Dashboard, theme, API config slices
├── styles/               # Global styles and Tailwind config
└── public/               # Static assets
```

## Technologies Used

- **Frontend**: Next.js, React
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, React Chart.js 2
- **Drag & Drop**: React Grid Layout
- **Icons**: React Icons (Feather Icons)
- **APIs**: Alpha Vantage, Finnhub, Custom REST APIs
- **Storage**: LocalStorage for API configurations and dashboard state

## Quick Start Guide

1. **Clone & Install**: `git clone` → `npm install` → `npm run dev`
2. **Configure APIs**: Click Settings (⚙️) → Add your API keys → Test & Enable
3. **Choose Template**: Click Templates or "Add Widget" to get started
4. **Customize**: Drag, resize, and configure widgets to your liking
5. **Save & Export**: Your dashboard auto-saves and can be exported/imported

## Getting API Keys

- **Alpha Vantage**: Free at [alphavantage.co](https://www.alphavantage.co/support/#api-key)
- **Finnhub**: Free at [finnhub.io](https://finnhub.io/)



# Finance Dashboard

A customizable real-time finance monitoring dashboard built with Next.js and React.

## Features

- **Real-time Data**: Live stock market data from Alpha Vantage API
- **Customizable Widgets**: Add, remove, and configure various widget types
- **Interactive Charts**: Visualize stock data with Chart.js
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Toggle between dark and light modes
- **Drag & Drop**: Rearrange widgets with drag-and-drop functionality
- **Data Persistence**: Dashboard state saves automatically
- **Export/Import**: Backup and restore dashboard configurations

## Widget Types

1. **Stock Table**: Display stock data in searchable, sortable tables
2. **Stock Chart**: Interactive price charts with multiple timeframes
3. **Stock Card**: Compact cards showing key metrics and data

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Alpha Vantage API key (included in the project)

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

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js Finance Dashboard. Follow these steps:

#### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your repository: `krizto8/Next.js-Fin-Dashboard`

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project → Settings → Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY = JREDSN7N8KV2IEBK
     NEXT_PUBLIC_API_BASE_URL = https://www.alphavantage.co/query
     ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your dashboard will be available at: `https://your-project-name.vercel.app`

#### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd fin_dashboard
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Set environment variables when prompted
   - Deploy with `vercel --prod` for production

#### Method 3: Deploy via Vercel Dashboard

1. **Create a production build locally**:
   ```bash
   npm run build
   ```

2. **Zip your project files** (exclude `node_modules` and `.git`)

3. **Upload to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Choose "Upload" option
   - Drag and drop your zip file
   - Configure environment variables
   - Deploy

### Environment Variables for Production

Make sure to set these environment variables in your Vercel project:

```env
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=JREDSN7N8KV2IEBK
NEXT_PUBLIC_API_BASE_URL=https://www.alphavantage.co/query
```

### Post-Deployment

After successful deployment:

1. **Custom Domain** (Optional):
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Performance Monitoring**:
   - Monitor your dashboard performance in Vercel Analytics
   - Check API usage in Alpha Vantage dashboard

3. **Automatic Deployments**:
   - Every push to your main branch will trigger automatic deployment
   - Pull requests create preview deployments

### Troubleshooting Deployment

**Common Issues:**

1. **Build Fails**: Check your local build with `npm run build`
2. **API Not Working**: Verify environment variables are set correctly
3. **Icons Missing**: Ensure all React Icons dependencies are in `package.json`
4. **Chart.js Errors**: Verify Chart.js adapters are installed: `npm install chartjs-adapter-date-fns`

**Useful Commands:**
```bash
# Check deployment logs
vercel logs [deployment-url]

# Redeploy latest commit
vercel --prod

# Preview deployment
vercel

# Check project status
vercel ls
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

- **Rearrange**: Drag widgets to new positions
- **Resize**: Drag the corner of widgets to resize them
- **Export**: Download your dashboard configuration
- **Import**: Upload a previously saved configuration
- **Clear**: Remove all widgets from the dashboard

## API Integration

The dashboard uses the Alpha Vantage API for real-time financial data:

- Stock quotes and time series data
- Top gainers and losers
- Symbol search functionality
- Intraday, daily, weekly, and monthly data

API calls are automatically cached and rate-limited to respect API quotas.

## Customization

### Adding New Widget Types

1. Create a new component in `components/widgets/types/`
2. Add the widget type to the dashboard slice
3. Update the widget factory in the main widget component
4. Add configuration options in the modals

### Styling

The project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`.

### API Configuration

API settings can be modified in `.env.local`:

```env
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=https://www.alphavantage.co/query
```

## Project Structure

```
fin_dashboard/
├── components/
│   ├── common/           # Shared components
│   ├── layout/           # Layout components
│   ├── modals/           # Modal components
│   ├── providers/        # Context providers
│   └── widgets/          # Widget components
├── hooks/                # Custom React hooks
├── pages/                # Next.js pages
├── store/                # Redux store and slices
├── styles/               # Global styles
└── public/               # Static assets
```

## Technologies Used

- **Frontend**: Next.js, React
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, React Chart.js 2
- **Drag & Drop**: React Grid Layout
- **Icons**: React Icons (Feather Icons)
- **API**: Alpha Vantage Financial API



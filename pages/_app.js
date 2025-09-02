import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import ThemeProvider from '../components/providers/ThemeProvider';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

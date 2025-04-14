// pages/_app.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/src/redux/store';
import { ThemeProvider } from '@/src/context/themecontext';
import '@/src/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      // Default 'online' networkMode pauses queries while navigator.onLine is
      // false instead of failing them — a genuinely dropped connection would
      // sit as a silent, un-erroring skeleton/stale grid forever. 'always'
      // lets the fetch itself fail and surface through the normal error UI.
      networkMode: 'always',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);

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
      // false instead of running them at all — the offline/cache fallback in
      // src/offline/usersRepository.ts (network first, IndexedDB snapshot on
      // failure) would never even get a chance to run. 'always' lets the
      // queryFn execute regardless, so it can try the network and fall back.
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


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function prepare() {
  if (typeof window === 'undefined') return;

  try {
    const { worker } = await import('./mocks/browser');
    
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        // Point to the root location of the worker script
        url: '/mockServiceWorker.js'
      }
    });
    console.log('[MSW] Mocking enabled.');
  } catch (error) {
    console.error('[MSW] Initialization failed:', error);
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  // We use .finally() to ensure that the React application is rendered 
  // even if MSW fails to initialize (e.g., in environments where Service Workers are blocked).
  prepare().finally(() => {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}

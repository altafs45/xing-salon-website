import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { preloadPage } from './App';
import './index.css';

// The page's code first: rendering replaces the prerendered HTML, so it must have something to replace it with.
const start = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
preloadPage().then(start, start);

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App, { preloadPage } from './App';
import { startHydration } from './lib/hydration';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The page's code first, so the first render has everything the HTML has. A prerendered page is hydrated: React keeps
// its HTML (no flash, no blank frame). The dev server's page holds only the skeleton, which a fresh render replaces.
const start = () => {
  if (root.firstElementChild && !root.querySelector(':scope > [data-skeleton]')) {
    startHydration();
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
};
preloadPage().then(start, start);

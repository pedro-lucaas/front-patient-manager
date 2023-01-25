import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'

import App from './App';

// 👇️ IMPORTANT: use correct ID of your root element
// this is the ID of the div in your index.html file
const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement!);

// 👇️ if you use TypeScript, add non-null (!) assertion operator
// const root = createRoot(rootElement!);

root.render(
  // <StrictMode>
  <App />
  // </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ThumbStage from './ThumbStage.jsx';
import './styles.css';

const thumb = new URLSearchParams(location.search).get('thumb');

createRoot(document.getElementById('root')).render(
  <StrictMode>{thumb ? <ThumbStage id={thumb} /> : <App />}</StrictMode>,
);

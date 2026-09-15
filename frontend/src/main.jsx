import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './reset.css';
import './styles.css';
import './extras.css';
import './landing.css';
import './recovery.css';
import './auth-admin.css';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);

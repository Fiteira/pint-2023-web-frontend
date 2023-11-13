import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider } from './components/toasts/toast.js'
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);

reportWebVitals();

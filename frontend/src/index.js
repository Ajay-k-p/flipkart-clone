import React from 'react';
import ReactDOM from 'react-dom/client';  // Or 'react-dom' for older versions
import { Provider } from 'react-redux';  // Import Provider
import { store } from './redux/store';  // Import your store
import App from './App';  // Your main App component
import './index.css';  // If you have styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap App with Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
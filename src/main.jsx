import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import './main.css';

import { store } from './store';
import { Provider } from 'react-redux';

import { Toaster } from 'react-hot-toast';


ReactDOM.createRoot(document.getElementById('root')).render(<Provider store={store}><App /><Toaster position="bottom-left" reverseOrder={false} /></Provider>);

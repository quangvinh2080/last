import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter,Routes,Route, } from "react-router-dom";
import { LayoutProvider } from './contexts/LayoutContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  </React.StrictMode>
);

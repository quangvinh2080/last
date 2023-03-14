import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { BrowserRouter,Routes,Route, } from "react-router-dom";
import { LayoutProvider } from './contexts/LayoutContext';
import { TaskProvider } from './contexts/TaskContext';

dayjs.extend(duration);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LayoutProvider>
        <TaskProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </TaskProvider>
      </LayoutProvider>
    </BrowserRouter>
  </React.StrictMode>
);

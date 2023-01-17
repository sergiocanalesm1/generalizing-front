import 'babel-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from "@mui/material";

import { initFirebase } from './helpers/firebase_helper';
import theme from './common/theme';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { initBugReporter } from './helpers/bug_reporter';

initFirebase();
initBugReporter();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorker.unregister();


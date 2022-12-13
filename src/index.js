import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from "@mui/material";

import { initFirebase } from './helpers/firebase_helper';
import theme from './common/theme';
import * as serviceWorker from './serviceWorker';
import App from './App';

initFirebase();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById( 'root' )
);

serviceWorker.unregister();

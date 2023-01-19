import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";


export function initBugReporter(){
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new BrowserTracing()],
      
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0,
      });
}

export function reportError(error){
    if( process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION' ){
        // TODO setup source maps
        Sentry.captureException(error);
    }
    else{
        console.log(error)
    }
}
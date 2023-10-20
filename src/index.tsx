import React from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import {MICRO_SERVICE_SLUG} from './services/constants';
import {MicroserviceProps} from './types/micro-service-props';
import {Router} from './router';
import AppContextProvider from './context/appContext';

const renderMicroService = (App: React.FC) => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  let container: Root | null = null;
  const renderSlug = 'render' + MICRO_SERVICE_SLUG;
  const unmountSlug = 'unmount' + MICRO_SERVICE_SLUG;
  const containerSlug = MICRO_SERVICE_SLUG + '-container';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[renderSlug] = (containerId: string, props: MicroserviceProps) => {
    if (!container) {
      container = ReactDOM.createRoot(document.getElementById(containerId) as HTMLElement);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    container.render(<App {...props} />);
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[unmountSlug] = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    container?.unmount();
    container = null;
  };

  if (!document.getElementById(containerSlug)) {
    root.render(<App />);
  }
};

renderMicroService((props: MicroserviceProps) => {
  return (
    <React.StrictMode>
      <div id="hr">
        <AppContextProvider microserviceProps={props}>
          <Router {...props} />
        </AppContextProvider>
      </div>
    </React.StrictMode>
  );
});

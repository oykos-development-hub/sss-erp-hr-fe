import React from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import {MICRO_SERVICE_SLUG} from './services/constants';
import {MicroserviceProps} from './types/micro-service-props';
import {Router} from './router';

const renderMicroService = (App: React.FC) => {
  console.log('** renderMicroService triggered **');
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  let container: Root | null = null;
  const renderSlug = 'render' + MICRO_SERVICE_SLUG;
  const unmountSlug = 'unmount' + MICRO_SERVICE_SLUG;
  const containerSlug = MICRO_SERVICE_SLUG + '-container';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[renderSlug] = (containerId: string, props: MicroserviceProps) => {
    console.log('** renderMicroService render triggered **');
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
    console.log('** renderMicroService unmount triggered **');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    container?.unmount();
    container = null;
  };

  console.log('** renderMicroService container **', document.getElementById(containerSlug));
  if (!document.getElementById(containerSlug)) {
    root.render(<App />);
  }
};

renderMicroService((props: MicroserviceProps) => {
  console.log('renderMicroService is about to be triggered...');
  return (
    <React.StrictMode>
      <Router {...props} />
    </React.StrictMode>
  );
});

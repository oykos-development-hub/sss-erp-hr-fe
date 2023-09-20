import React, {useContext} from 'react';
import {appContext} from './hrModuleContext';

const useAppContext = () => {
  return useContext(appContext);
};

export default useAppContext;

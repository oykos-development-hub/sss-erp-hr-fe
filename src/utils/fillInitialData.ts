const fillInitialData = <D extends {}, I extends {}>(data: D, initialValues: I, setFunc: any) => {
  Object.entries(data).forEach(([key, value]) => {
    if (initialValues.hasOwnProperty(key)) {
      setFunc(key as keyof typeof initialValues, value);
    }
  });
};

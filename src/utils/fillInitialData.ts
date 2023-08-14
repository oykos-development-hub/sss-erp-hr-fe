const fillInitialData = <D extends object, I extends object>(
  data: D,
  initialValues: I,
  setFunc: (key: keyof I, value: any) => void,
) => {
  Object.entries(data).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
      setFunc(key as keyof typeof initialValues, value);
    }
  });
};

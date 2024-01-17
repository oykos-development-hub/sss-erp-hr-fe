export const generateDocumentSerialNumber = (id: number) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}-${id}/${year}`;
};

export const importExperienceExcel = async (file: File, token: string): Promise<any['data']> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://sss-erp-bff.oykos.me/files/import-expirience-excel', {
    method: 'POST',
    headers: {
      ...(token && {Authorization: `Bearer ${token}`}),
    },
    body: formData,
  });

  return await response.json();
};

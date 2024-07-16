export const importAnnualLeaveExcel = async (file: File, token: string): Promise<any['data']> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${import.meta.env.VITE_FILES_URL}/import-vacations-excel`, {
    method: 'POST',
    headers: {
      ...(token && {Authorization: `Bearer ${token}`}),
    },
    body: formData,
  });

  return await response.json();
};

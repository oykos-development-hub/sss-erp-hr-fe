export const formatData = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    user_profile_id: data?.user_profile_id,
    score: data?.score.id,
    is_relevant: data?.is_relevant?.id === 'Da' ? true : false,
    date_of_evaluation: data?.date_of_evaluation.id || data?.date_of_evaluation.title,
    file_id: data?.file_id,
  };

  delete payload.created_at;
  delete payload.updated_at;

  return payload;
};

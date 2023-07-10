import {useState} from 'react';
import {GraphQL} from '../..';

const useEvaluationDelete = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const deleteUserProfileEvaluation = async (id: number) => {
    setLoading(true);
    const response = await GraphQL.evaluationDelete(id);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteUserProfileEvaluation};
};

export default useEvaluationDelete;

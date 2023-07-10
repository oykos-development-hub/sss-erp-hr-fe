import {useState} from 'react';
import {GraphQL} from '..';

const useJudgeNormDelete = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const deleteRevision = async (id: number) => {
    setLoading(true);
    const response = await GraphQL.judgeNormDelete(id);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteRevision};
};

export default useJudgeNormDelete;

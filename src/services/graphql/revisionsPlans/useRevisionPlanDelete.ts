import {useState} from 'react';
import {GraphQL} from '..';

const useRevisionPlanDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteRevisionPlan = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.revisionPlanDelete(id);

    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteRevisionPlan};
};

export default useRevisionPlanDelete;

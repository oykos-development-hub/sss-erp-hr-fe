import {useState} from 'react';
import {revisionPlanInsertItem} from '../../../types/graphql/revisionPlanInsert';
import {GraphQL} from '..';

const useRevisionPlanInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertRevisionPlan = async (data: revisionPlanInsertItem, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.revisionPlanInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertRevisionPlan};
};

export default useRevisionPlanInsert;

import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileEvaluation} from '../../../../types/graphql/userProfileGetEvaluations';

const useEvaluationInsert = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const insertProfileEvaluation = async (data: UserProfileEvaluation) => {
    setLoading(true);
    const response = await GraphQL.evaluationInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProfileEvaluation};
};

export default useEvaluationInsert;

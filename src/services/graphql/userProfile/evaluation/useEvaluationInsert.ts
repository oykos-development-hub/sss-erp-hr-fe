import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileEvaluationFormValues} from '../../../../types/graphql/userProfileGetEvaluations';

const useEvaluationInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertProfileEvaluation = async (
    data: UserProfileEvaluationFormValues,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
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

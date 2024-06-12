import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileEvaluationParams, ProfileEvaluationResponse} from '../../../../types/graphql/evaluations';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertEvaluation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertEvaluation = async (data: ProfileEvaluationParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileEvaluationResponse['insert'] = await fetch(GraphQL.insertEvaluation, {data});

    if (response.userProfileEvaluation_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertEvaluation};
};

export default useInsertEvaluation;

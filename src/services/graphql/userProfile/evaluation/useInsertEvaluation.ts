import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileEvaluationFormValues, ProfileEvaluationResponse} from '../../../../types/graphql/evaluations';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertEvaluation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertEvaluation = async (data: ProfileEvaluationFormValues, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: ProfileEvaluationResponse['insert'] = await fetch(GraphQL.insertEvaluation, {data});

    if (response.userProfile_Evaluation_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertEvaluation};
};

export default useInsertEvaluation;

import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileEvaluationResponse} from '../../../../types/graphql/evaluations';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteEvaluation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteEvaluation = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileEvaluationResponse['delete'] = await fetch(GraphQL.deleteEvaluation, {id});

    if (response.userProfile_Evaluation_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteEvaluation};
};

export default useDeleteEvaluation;

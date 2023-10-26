import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {JudgeNormResponse} from '../../../../types/graphql/judgeNorms';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteJudgeNorm = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteJudgeNorm = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: JudgeNormResponse['delete'] = await fetch(GraphQL.deleteJudgeNorm, {id});

    if (response.judgeNorms_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteJudgeNorm};
};

export default useDeleteJudgeNorm;

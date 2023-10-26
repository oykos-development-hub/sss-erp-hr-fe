import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {JudgeResolutionResponse} from '../../../../types/graphql/judgeResolutions';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteJudgeResolution = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteJudgeResolution = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: JudgeResolutionResponse['delete'] = await fetch(GraphQL.deleteJudgeResolution, {id});

    if (response.judgeResolutions_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteJudgeResolution};
};

export default useDeleteJudgeResolution;

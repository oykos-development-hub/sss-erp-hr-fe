import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {JudgeResolutionResponse, JudgeResolutionsInsertParams} from '../../../../types/graphql/judgeResolutions';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertJudgeResolution = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertJudgeResolution = async (
    data: JudgeResolutionsInsertParams,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: JudgeResolutionResponse['insert'] = await fetch(GraphQL.insertJudgeResolution, {data});

    if (response.judgeResolutions_Insert?.status === REQUEST_STATUSES.success) {
      const id = response.judgeResolutions_Insert.item ? response.judgeResolutions_Insert.item.id : 0;
      onSuccess && onSuccess(id);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertJudgeResolution};
};

export default useInsertJudgeResolution;

import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {JudgeNormInsertParams, JudgeNormResponse} from '../../../../types/graphql/judgeNorms';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertJudgeNorm = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertJudgeNorm = async (data: JudgeNormInsertParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: JudgeNormResponse['insert'] = await fetch(GraphQL.insertJudgeNorm, {data});

    if (response.judgeNorms_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertJudgeNorm};
};

export default useInsertJudgeNorm;

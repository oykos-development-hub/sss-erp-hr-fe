import {useState} from 'react';
import {GraphQL} from '..';
import {JudgeNormInsertParams} from '../../../types/graphql/judges';

const useJudgeNormInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertJudgeNorms = async (data: JudgeNormInsertParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.judgeNormInsert({data});
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertJudgeNorms};
};

export default useJudgeNormInsert;

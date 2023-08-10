import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {JudgeResolutionsInsert} from '../../../types/graphql/judges';

const useJudgeResoultionInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertJudgeResolutions = async (
    data: JudgeResolutionsInsert,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.judgeResolutionInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      const id = response.items ? response.items[0].id : 0;
      onSuccess && onSuccess(id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertJudgeResolutions};
};

export default useJudgeResoultionInsert;

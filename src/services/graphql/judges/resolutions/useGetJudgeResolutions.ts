import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {JudgeResolution, JudgeResolutionResponse} from '../../../../types/graphql/judgeResolutions';
import {PaginationProps} from '../../../../types/paginationParams';

const useGetJudgeResolutions = ({page, size}: PaginationProps) => {
  const [judgeResolutions, setJudgeResolutions] = useState<JudgeResolution[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJudgeResolutions = async () => {
    const response: JudgeResolutionResponse['get'] = await fetch(GraphQL.getJudgeResolutions, {page, size});

    if (response.judgeResolutions_Overview?.items) {
      setTotal(response.judgeResolutions_Overview.total || 0);
      setJudgeResolutions(response.judgeResolutions_Overview.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJudgeResolutions();
  }, [page, size]);

  return {judgeResolutions, total, loading, refetch: fetchJudgeResolutions};
};

export default useGetJudgeResolutions;

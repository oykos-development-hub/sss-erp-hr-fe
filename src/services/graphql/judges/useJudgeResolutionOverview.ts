import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JudgeResolution, JudgesResolutionsOverviewQueryParams} from '../../../types/graphql/judges';

const useJudgesResolutionOverview = ({page, size}: JudgesResolutionsOverviewQueryParams) => {
  const [data, setData] = useState<JudgeResolution[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchJudgesResolutionsOverview = async () => {
    const response = await GraphQL.judgeResolutionOverview({
      page: page,
      size: size,
    });

    if (response?.items) {
      setTotal(response?.total || 0);
      setData(response?.items);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJudgesResolutionsOverview();
  }, [page, size]);

  return {data, total, loading, refetch: fetchJudgesResolutionsOverview};
};

export default useJudgesResolutionOverview;

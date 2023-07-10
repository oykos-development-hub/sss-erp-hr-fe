import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JudgeResolutionOverview, JudgesResolutionsOverviewQueryParams} from '../../../types/graphql/judges';

const useJudgesResolutionOverview = ({page, size, year}: JudgesResolutionsOverviewQueryParams) => {
  const [data, setData] = useState<JudgeResolutionOverview[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchJudgesResolutionsOverview = async () => {
    const response = await GraphQL.judgeResolutionOverview({
      page: page,
      size: size,
      year: year,
    });
    setTotal(response?.total || 0);
    setData(response?.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchJudgesResolutionsOverview();
  }, [page, size, year]);

  return {data, total, loading, refetch: fetchJudgesResolutionsOverview};
};

export default useJudgesResolutionOverview;

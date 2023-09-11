import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JudgeResolutionItem} from '../../../types/graphql/judges';

const useOrganizationUintCalculateEmployeeStats = () => {
  const [data, setData] = useState<JudgeResolutionItem[]>();
  const [loading, setLoading] = useState(true);

  const fetchJudgesResolutionsOverview = async () => {
    const response = await GraphQL.organizationUintCalculateEmployeeStats();
    setData(response?.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchJudgesResolutionsOverview();
  }, []);

  return {data, loading, refetch: fetchJudgesResolutionsOverview};
};

export default useOrganizationUintCalculateEmployeeStats;

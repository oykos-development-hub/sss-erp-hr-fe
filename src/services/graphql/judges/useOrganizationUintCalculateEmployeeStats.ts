import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JudgeResolutionItem} from '../../../types/graphql/judges';

const useOrganizationUnitRealJudgeNumberData = () => {
  const [judgesData, setJudgesData] = useState<JudgeResolutionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRealJudgeNumberData = async () => {
    const response = await GraphQL.getOrganizationUnitRealJudgeNumberData();
    if (response?.items) {
      setJudgesData(response?.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRealJudgeNumberData();
  }, []);

  return {judgesData, loading, refetch: fetchRealJudgeNumberData};
};

export default useOrganizationUnitRealJudgeNumberData;

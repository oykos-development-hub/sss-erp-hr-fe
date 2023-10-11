import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JudgeResolutionItem} from '../../../types/graphql/judges';

const useOrganizationUnitRealJudgeNumberData = ({
  resolution_id,
  active,
}: {
  resolution_id: number | null;
  active: boolean;
}) => {
  const [judgesData, setJudgesData] = useState<JudgeResolutionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRealJudgeNumberData = async () => {
    const response = await GraphQL.getOrganizationUnitRealJudgeNumberData(resolution_id, active);
    if (response?.items) {
      setJudgesData(response?.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRealJudgeNumberData();
  }, [resolution_id, active]);

  return {judgesData, loading, refetch: fetchRealJudgeNumberData};
};

export default useOrganizationUnitRealJudgeNumberData;

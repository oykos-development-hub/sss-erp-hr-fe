import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {JudgeResolutionItem, JudgeResolutionResponse} from '../../../../types/graphql/judgeResolutions';
import useAppContext from '../../../../context/useAppContext';

const useGetCurrentResolutionNumbers = ({resolution_id, active}: {resolution_id: number | null; active?: boolean}) => {
  const [judgesData, setJudgesData] = useState<JudgeResolutionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJudgesData = async (onSuccess?: (data: JudgeResolutionItem[]) => void) => {
    setLoading(true);

    const response: JudgeResolutionResponse['getCurrentNumbers'] = await fetch(GraphQL.getCurrentResolutionNumbers, {
      resolution_id,
      active,
    });

    if (response.organizationUintCalculateEmployeeStats?.items) {
      setJudgesData(response.organizationUintCalculateEmployeeStats.items);
      onSuccess && onSuccess(response.organizationUintCalculateEmployeeStats.items);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJudgesData();
  }, [resolution_id, active]);

  return {judgesData, loading, refetch: fetchJudgesData};
};

export default useGetCurrentResolutionNumbers;

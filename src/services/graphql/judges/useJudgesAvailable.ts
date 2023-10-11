import {useState} from 'react';
import {GraphQL} from '..';
import {JudgeAndPresidentIsAvailable} from '../../../types/graphql/judges';

const useJudgesAvailable = () => {
  const [checkAvailable, setData] = useState<JudgeAndPresidentIsAvailable>();

  const fetchCheckJudgeAndPresidentIsAvailable = async (organization_unit_id: number) => {
    const response = await GraphQL.judgeAndPresidentCheckIsAvailable(organization_unit_id);

    setData(response?.item);
  };

  return {checkAvailable, refetch: fetchCheckJudgeAndPresidentIsAvailable};
};

export default useJudgesAvailable;

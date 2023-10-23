import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {AvailableJudges, AvailableJudgesResponse} from '../../../types/graphql/judges';

const useJudgesAvailable = () => {
  const [judgeAvailablity, setJudgeAvailability] = useState<AvailableJudges>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJudgeAvailability = async (organization_unit_id: number) => {
    setLoading(true);

    const response: AvailableJudgesResponse = await fetch(GraphQL.getJudgeAvailability, {organization_unit_id});

    if (response.checkJudgeAndPresidentIsAvailable?.item) {
      setJudgeAvailability(response.checkJudgeAndPresidentIsAvailable.item);
    }

    setLoading(false);
  };

  return {judgeAvailablity, loading, refetch: fetchJudgeAvailability};
};

export default useJudgesAvailable;

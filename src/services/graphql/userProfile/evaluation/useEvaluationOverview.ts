import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileEvaluation} from '../../../../types/graphql/userProfileGetEvaluations';

const useEvaluationOverview = (id: number) => {
  const [userEvaluationData, setUserEvaluationData] = useState<UserProfileEvaluation[]>();
  const [loading, setLoading] = useState(true);

  const fetchUserEvaluation = async () => {
    const response = await GraphQL.evaluationOverview(id);
    const data = response?.items;

    setUserEvaluationData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserEvaluation();
  }, [id]);

  return {data: userEvaluationData, loading, refetchData: fetchUserEvaluation};
};

export default useEvaluationOverview;

import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileEvaluation, ProfileEvaluationResponse} from '../../../../types/graphql/evaluations';
import {REQUEST_STATUSES} from '../../../constants';

const useGetEvaluations = (id: number) => {
  const [evaluations, setEvaluations] = useState<ProfileEvaluation[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchEvaluations = async () => {
    setLoading(true);

    const response: ProfileEvaluationResponse['get'] = await fetch(GraphQL.getEvaluations, {user_profile_id: id});

    if (response.userProfile_Evaluation?.status === REQUEST_STATUSES.success) {
      setEvaluations(response.userProfile_Evaluation?.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvaluations();
  }, [id]);

  return {evaluations, loading, refetch: fetchEvaluations};
};

export default useGetEvaluations;

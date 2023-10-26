import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileVacation, ProfileVacationResponse} from '../../../../types/graphql/vacations';
import {REQUEST_STATUSES} from '../../../constants';

const useGetVacations = (user_profile_id: number) => {
  const [vacations, setVacations] = useState<ProfileVacation[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchVacations = async () => {
    setLoading(true);

    const response: ProfileVacationResponse['get'] = await fetch(GraphQL.getVacation, {user_profile_id});

    if (response.userProfile_Vacation?.status === REQUEST_STATUSES.success) {
      setVacations(response.userProfile_Vacation?.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVacations();
  }, [user_profile_id]);

  return {vacations, loading, refetch: fetchVacations};
};

export default useGetVacations;

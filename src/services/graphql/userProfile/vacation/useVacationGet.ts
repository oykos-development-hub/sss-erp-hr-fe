import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {YearVacationType} from '../../../../types/graphql/profileVacationTypes';

const useVacationGet = (user_profile_id: number) => {
  const [userVacation, setUserVacation] = useState<YearVacationType[]>();
  const [loading, setLoading] = useState(true);

  const fetchUserVacation = async () => {
    const response = await GraphQL.getVacation(user_profile_id);
    const vacation = response?.items;
    setUserVacation(vacation);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserVacation();
  }, [user_profile_id]);

  return {vacationData: userVacation, loading, refetcUserVacation: fetchUserVacation};
};

export default useVacationGet;

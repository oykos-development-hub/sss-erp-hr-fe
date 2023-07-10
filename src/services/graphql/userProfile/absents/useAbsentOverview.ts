import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {SumaryTypes, UserProfileAbsents} from '../../../../types/graphql/profileAbsentsTypes';

const useAbsentOverview = (id: number) => {
  const [userAbsents, setUserAbsents] = useState<UserProfileAbsents[]>();
  const [loading, setLoading] = useState(true);
  const [userSummary, setUserSummary] = useState<SumaryTypes>();

  const fetchUserAbsents = async () => {
    const response = await GraphQL.absentOverview(id);
    const absents = response?.items;
    const summary = response?.summary;

    setUserAbsents(absents);
    setUserSummary(summary);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserAbsents();
  }, [id]);

  return {absentsData: userAbsents, summary: userSummary, loading, refetchData: fetchUserAbsents};
};

export default useAbsentOverview;

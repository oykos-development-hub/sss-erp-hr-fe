import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {AbsentType} from '../../../../types/graphql/profileAbsentsTypes';

const useAbsentTypesOverview = (page?: number, size?: number) => {
  const [absents, setAbsents] = useState<AbsentType[]>();
  const [loading, setLoading] = useState(true);

  const fetchUserAbsents = async () => {
    const response = await GraphQL.absentTypesOverview(page, size);
    const absents = response?.items;

    setAbsents(absents);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserAbsents();
  }, []);

  return {absentsTypeData: absents, loading, refetchData: fetchUserAbsents};
};

export default useAbsentTypesOverview;

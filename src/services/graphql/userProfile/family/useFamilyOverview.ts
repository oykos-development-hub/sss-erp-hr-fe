import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileFamily} from '../../../../types/graphql/userProfileGetFamilyTypes';

const useFamilyOverview = (id: number) => {
  const [userFamily, setUserFamily] = useState<UserProfileFamily[]>();
  const [loading, setLoading] = useState(true);

  const fetchUserFamily = async () => {
    const response = await GraphQL.familyOverview(id);
    const family = response?.items;

    setUserFamily(family);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserFamily();
  }, [id]);

  return {familyData: userFamily, loading, refetchData: fetchUserFamily};
};

export default useFamilyOverview;

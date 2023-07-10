import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileResolutionItem} from '../../../../types/graphql/userProfileGetResolution';

const useResolutionOverview = (id: number) => {
  const [userProfileResolution, setUserProfileResolution] = useState<UserProfileResolutionItem[]>();
  const [loading, setLoading] = useState(true);

  const fetchUserProfileResolution = async () => {
    const response = await GraphQL.resolutionOverview(id);
    const resolution = response.items;

    setUserProfileResolution(resolution);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfileResolution();
  }, [id]);

  return {data: userProfileResolution, loading, fetch: fetchUserProfileResolution};
};

export default useResolutionOverview;

import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileBasicInfo, ProfileBasicInfoResponse} from '../../../../types/graphql/basicInfo';
import {QueryOptions} from '../../../../types/queryOptions';

const useGetBasicInfo = (id: number, options?: QueryOptions) => {
  const [userBasicInfo, setUserBasicInfo] = useState<ProfileBasicInfo>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchUserBasicInfo = async () => {
    const response: ProfileBasicInfoResponse['details'] = await fetch(GraphQL.getBasicInfo, {user_profile_id: id});

    const user = response?.userProfile_Basic?.item;

    if (user) {
      setUserBasicInfo(user);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!options?.skip) {
      fetchUserBasicInfo();
    }
  }, [id]);

  return {userBasicInfo, loading, refetch: fetchUserBasicInfo};
};

export default useGetBasicInfo;

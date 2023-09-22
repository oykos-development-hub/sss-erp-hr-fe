import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileBasicInfo} from '../../../../types/graphql/userProfiles';

const useBasicInfoGet = (id: number) => {
  const [userBasicInfo, setUserBasicInfo] = useState<UserProfileBasicInfo>();
  const [loading, setLoading] = useState(true);

  const fetchUserBasicInfo = async () => {
    const response = await GraphQL.basicInfoGet(id);
    const user = response?.data?.userProfile_Basic?.item;

    setUserBasicInfo(user);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserBasicInfo();
  }, [id]);

  return {data: userBasicInfo, loading, refetch: fetchUserBasicInfo};
};

export default useBasicInfoGet;

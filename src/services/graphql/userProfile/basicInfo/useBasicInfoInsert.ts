import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileBasicInfo, UserProfileBasicInfoFormValues} from '../../../../types/graphql/userProfiles';

const useBasicInfoInsert = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(0);

  const insertBasicInfo = async (
    data: UserProfileBasicInfoFormValues,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.basicInfoInsert(data);
    if (response.status === 'success') {
      setUserId(response?.item?.id || 0);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertBasicInfo, userId};
};

export default useBasicInfoInsert;

import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileBasicInfoFormValues} from '../../../../types/graphql/userProfiles';

const useProfileBasicUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateBasicInfo = async (
    data: UserProfileBasicInfoFormValues,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.basicInfoUpdate(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: updateBasicInfo};
};

export default useProfileBasicUpdate;

import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileBasicInfoFormValues} from '../../../../types/graphql/userProfiles';

const useBasicInfoInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertBasicInfo = async (
    data: UserProfileBasicInfoFormValues,
    onSuccess?: (userId: number) => void,
    onError?: (response: any) => void,
  ) => {
    setLoading(true);

    const response = await GraphQL.basicInfoInsert(data);

    if (response.status === 'success') {
      onSuccess && onSuccess(response?.item?.id || 0);
    } else if (response.message === 'user_email_exist') {
      onError && onError(response);
    } else {
      onError && onError(response);
    }
    setLoading(false);
  };

  return {loading, mutate: insertBasicInfo};
};

export default useBasicInfoInsert;

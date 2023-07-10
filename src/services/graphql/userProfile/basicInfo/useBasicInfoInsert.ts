import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileBasicInfo} from '../../../../types/graphql/userProfiles';

const useBasicInfoInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertBasicInfo = async (data: UserProfileBasicInfo, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.basicInfoInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertBasicInfo};
};

export default useBasicInfoInsert;

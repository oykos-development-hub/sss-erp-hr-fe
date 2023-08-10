import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {UserProfileFamily} from '../../../../types/graphql/userProfileGetFamilyTypes';

const useFamilyInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertProfileFamily = async (data: UserProfileFamily, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.familyInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProfileFamily};
};

export default useFamilyInsert;

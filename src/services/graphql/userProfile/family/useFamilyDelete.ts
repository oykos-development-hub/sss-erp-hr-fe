import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useFamilyDelete = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const deleteUserProfileFamily = async (id: number) => {
    setLoading(true);
    const response = await GraphQL.familyDelete(id);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteUserProfileFamily, success: onSuccess, error: onError};
};

export default useFamilyDelete;

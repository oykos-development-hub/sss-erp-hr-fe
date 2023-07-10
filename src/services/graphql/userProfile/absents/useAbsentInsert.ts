import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {UserProfileAbsentsParams} from '../../../../types/graphql/profileAbsentsTypes';

const useAbsentInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertProfileAbsents = async (data: UserProfileAbsentsParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.absentInsert(data);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProfileAbsents};
};

export default useAbsentInsert;

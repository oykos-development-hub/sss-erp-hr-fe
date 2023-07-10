import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {UserProfileResolutionParams} from '../../../../types/graphql/userProfileGetResolution';

const useResolutionInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertProfileResolution = async (
    data: UserProfileResolutionParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.resolutionInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProfileResolution};
};

export default useResolutionInsert;

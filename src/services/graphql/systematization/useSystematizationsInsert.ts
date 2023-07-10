import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {SystematizationsInsertParams} from '../../../types/graphql/systematizationsInsertTypes';

const useSystematizationInsert = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const insertSystematizations = async (data: SystematizationsInsertParams) => {
    setLoading(true);
    const response = await GraphQL.systematizationInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertSystematizations, success: onSuccess, error: onError};
};

export default useSystematizationInsert;

import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';

const useSystematizationDelete = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const deleteSystematization = async (id: number) => {
    setLoading(true);
    const response = await GraphQL.systematizationDelete(id);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteSystematization, success: onSuccess, error: onError};
};

export default useSystematizationDelete;

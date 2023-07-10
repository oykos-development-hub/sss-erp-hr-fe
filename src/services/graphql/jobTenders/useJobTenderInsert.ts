import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {JobTender} from '../../../types/graphql/jobTenders';

const useJobTenderInsert = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const insertJobTender = async (data: JobTender) => {
    setLoading(true);
    const response = await GraphQL.jobTenderInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertJobTender, success: onSuccess, error: onError};
};

export default useJobTenderInsert;

import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {JobTender} from '../../../types/graphql/jobTenders';

const useJobTenderInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertJobTender = async (data: JobTender, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.jobTenderInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertJobTender};
};

export default useJobTenderInsert;

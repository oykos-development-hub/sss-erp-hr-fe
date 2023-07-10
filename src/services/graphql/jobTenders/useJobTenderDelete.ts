import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';

const useJobTenderDelete = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const deleteJobTenders = async (id: number) => {
    setLoading(true);
    const response = await GraphQL.jobTenderDelete(id);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteJobTenders};
};

export default useJobTenderDelete;

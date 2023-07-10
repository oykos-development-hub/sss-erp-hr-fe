import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';

const useJobTenderApplicationDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteJobTenders = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.jobTenderApplicationDelete(id);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteJobTenders};
};

export default useJobTenderApplicationDelete;

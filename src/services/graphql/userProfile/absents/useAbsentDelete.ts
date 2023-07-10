import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useAbsentDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteAbsents = async (id: number, vacationTypeId: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.absentDelete(id, vacationTypeId);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteAbsents};
};

export default useAbsentDelete;

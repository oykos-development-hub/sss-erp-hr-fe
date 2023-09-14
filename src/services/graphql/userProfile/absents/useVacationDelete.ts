import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useVacationDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteVacation = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.vacationDelete(id);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, deleteVacation: deleteVacation};
};

export default useVacationDelete;

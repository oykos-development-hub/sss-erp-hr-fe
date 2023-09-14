import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {UserProfileVacationParams} from '../../../../types/graphql/profileVacationTypes';

const useVacationInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertProfileVacation = async (
    data: UserProfileVacationParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (!loading) {
      setLoading(true);
      const response = await GraphQL.vacationInsert(data);

      if (response.status === REQUEST_STATUSES.success) {
        onSuccess && onSuccess();
      } else if (response.status === REQUEST_STATUSES.error) {
        onError && onError();
      }
      setLoading(false);
    }
  };

  return {loading, mutate: insertProfileVacation};
};

export default useVacationInsert;

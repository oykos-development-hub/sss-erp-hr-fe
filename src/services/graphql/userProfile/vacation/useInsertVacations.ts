import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileVacationParams, ProfileVacationResponse} from '../../../../types/graphql/vacations';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertVacations = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertVacations = async (data: ProfileVacationParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileVacationResponse['insert'] = await fetch(GraphQL.insertVacations, {data});

    if (response.userProfile_Vacations_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertVacations};
};

export default useInsertVacations;

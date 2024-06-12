import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {AbsentResponse} from '../../../../types/graphql/absents';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteAbsence = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteAbsence = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: AbsentResponse['delete'] = await fetch(GraphQL.deleteAbsence, {id});

    if (response.userProfileAbsent_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: deleteAbsence};
};

export default useDeleteAbsence;

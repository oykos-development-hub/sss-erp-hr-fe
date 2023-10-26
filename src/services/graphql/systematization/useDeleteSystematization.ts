import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {SystematizationsResponse} from '../../../types/graphql/systematizationsTypes';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteSystematization = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteSystematization = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);
    const response: SystematizationsResponse['delete'] = await fetch(GraphQL.deleteSystematization, {id});

    if (response.systematizations_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: deleteSystematization};
};

export default useDeleteSystematization;

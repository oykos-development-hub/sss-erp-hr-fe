import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {ForeignerPermitResponse} from '../../../types/graphql/foreignerPermits';

const useDeleteForeignerPermit = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteForeignerPermit = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ForeignerPermitResponse['delete'] = await fetch(GraphQL.deleteForeignerPermit, {id});

    if (response.userProfileForeigner_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: deleteForeignerPermit};
};

export default useDeleteForeignerPermit;

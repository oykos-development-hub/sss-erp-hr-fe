import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {ForeignerPermit, ForeignerPermitResponse} from '../../../types/graphql/foreignerPermits';

const useInsertForeignerPermits = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertForeignerPermit = async (data: ForeignerPermit, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: ForeignerPermitResponse['insert'] = await fetch(GraphQL.insertForeignerPermit, {data});

    if (response.userProfile_Foreigner_Insert.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: insertForeignerPermit};
};

export default useInsertForeignerPermits;

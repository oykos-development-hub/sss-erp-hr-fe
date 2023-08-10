import {useState} from 'react';
import {GraphQL} from '..';
import {ForeignerPermit} from '../../../types/graphql/foreignerPermits';

const useForeignerPermitInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertForeignerPermit = async (data: ForeignerPermit, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.foreignerPermitInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertForeignerPermit};
};

export default useForeignerPermitInsert;

import {useState} from 'react';
import {GraphQL} from '..';

const useForeignerPermitDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteForeignerPermit = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.foreignerPermitDelete(id);

    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteForeignerPermit};
};

export default useForeignerPermitDelete;

import {useState} from 'react';
import {GraphQL} from '..';

const useRevisionDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteRevision = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.revisionDelete(id);

    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteRevision};
};

export default useRevisionDelete;

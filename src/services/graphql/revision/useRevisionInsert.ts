import {useState} from 'react';
import {GraphQL} from '..';
import {revisionInsertItem} from '../../../types/graphql/revisionInsert';

const useRevisionInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertRevision = async (data: revisionInsertItem, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.revisionInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertRevision};
};

export default useRevisionInsert;

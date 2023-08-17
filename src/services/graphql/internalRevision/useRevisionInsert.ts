import {useState} from 'react';
import {GraphQL} from '..';
import {InternalRevisionInsertParams} from '../../../screens/internalRevision/types';

const useRevisionInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertInternalRevision = async (
    data: InternalRevisionInsertParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.revisionInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertInternalRevision};
};

export default useRevisionInsert;

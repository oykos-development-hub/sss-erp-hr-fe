import {useState} from 'react';
import {GraphQL} from '..';
import {revisionTipsInsertItem} from '../../../types/graphql/revisionTipsInsert';

const useRevisionTipsInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertRevisionTips = async (data: revisionTipsInsertItem, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.revisionTipsInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertRevisionTips};
};

export default useRevisionTipsInsert;

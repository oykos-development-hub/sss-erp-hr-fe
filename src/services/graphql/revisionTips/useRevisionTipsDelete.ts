import {useState} from 'react';
import {GraphQL} from '..';

const useRevisionTipsDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteRevisionTips = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.revisionTipsDelete(id);

    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteRevisionTips};
};

export default useRevisionTipsDelete;

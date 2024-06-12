import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionTipsResponse} from '../../../types/graphql/revisionTips';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteRevisionTip = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteRevisionTip = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: RevisionTipsResponse['delete'] = await fetch(GraphQL.deleteRevisionTip, {id});

    if (response.revisionTips_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteRevisionTip};
};

export default useDeleteRevisionTip;

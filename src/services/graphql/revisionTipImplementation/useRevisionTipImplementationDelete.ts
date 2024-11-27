import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionTipImplementationsResponse, RevisionTipsResponse} from '../../../types/graphql/revisionTips';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteRevisionTipImplementation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteRevisionTipImplementation = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: RevisionTipImplementationsResponse['delete'] = await fetch(GraphQL.deleteRevisionTipImplementation, {id});

    if (response.revisionTipImplementation_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteRevisionTipImplementation};
};

export default useDeleteRevisionTipImplementation;

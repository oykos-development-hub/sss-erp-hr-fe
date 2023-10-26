import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionResponse} from '../../../types/graphql/revisions';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteRevision = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteRevision = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: RevisionResponse['delete'] = await fetch(GraphQL.deleteRevision, {id});

    if (response.revision_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteRevision};
};

export default useDeleteRevision;

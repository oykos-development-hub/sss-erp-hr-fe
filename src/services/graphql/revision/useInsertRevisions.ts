import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {revisionInsertItem} from '../../../types/graphql/revisionInsert';
import {RevisionResponse} from '../../../types/graphql/revisions';
import {REQUEST_STATUSES} from '../../constants';

const useInsertRevision = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertRevision = async (data: revisionInsertItem, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: RevisionResponse['insert'] = await fetch(GraphQL.insertRevision, {data});

    if (response.revision_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertRevision};
};

export default useInsertRevision;

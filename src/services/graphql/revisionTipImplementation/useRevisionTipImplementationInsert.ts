import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionTipImplementationsResponse, RevisionTipInsertParams, RevisionTipsResponse} from '../../../types/graphql/revisionTips';

const useInsertRevisionTipImplementation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertRevisionTipImplementation = async (data: RevisionTipInsertParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: RevisionTipImplementationsResponse['insert'] = await fetch(GraphQL.insertRevisionTipImplementation, {data});

    if (response.revisionTipImplementation_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertRevisionTipImplementation};
};

export default useInsertRevisionTipImplementation;

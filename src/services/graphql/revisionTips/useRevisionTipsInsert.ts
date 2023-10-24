import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionTipInsertParams, RevisionTipsResponse} from '../../../types/graphql/revisionTips';

const useInsertRevisionTip = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertRevisionTip = async (data: RevisionTipInsertParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: RevisionTipsResponse['insert'] = await fetch(GraphQL.insertRevisionTip, {data});

    if (response.revision_tips_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertRevisionTip};
};

export default useInsertRevisionTip;

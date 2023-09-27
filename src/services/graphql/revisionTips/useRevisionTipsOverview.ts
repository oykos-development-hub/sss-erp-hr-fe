import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {RevisionTipsParams} from '../../../types/graphql/revisionTipsOverview';

const initialState = {items: [], total: 0, message: '', revisors: [], status: ''};

const useRevisionTipsOverview = ({page, size, revision_id}: RevisionTipsParams) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchRevisionTips = async () => {
    const response = await GraphQL.revisionTipsOverview(revision_id);

    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionTips();
  }, [page, size]);

  return {data, loading, refetch: fetchRevisionTips};
};

export default useRevisionTipsOverview;

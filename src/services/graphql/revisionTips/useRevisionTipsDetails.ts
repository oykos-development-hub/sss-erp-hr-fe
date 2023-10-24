import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionTipsResponse} from '../../../types/graphql/revisionTips';
import {REQUEST_STATUSES} from '../../constants';

const useGetRevisionTipDetails = (id: number) => {
  const [revisionTipDetails, setRevisionTipDetails] = useState<any>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionTipDetails = async () => {
    const response: RevisionTipsResponse['details'] = await fetch(GraphQL.getRevisionTipDetails, {id});

    if (response.revision_tips_Details?.status === REQUEST_STATUSES.success) {
      setRevisionTipDetails(response.revision_tips_Details?.item);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchRevisionTipDetails();
    }
  }, [id]);

  return {revisionTipDetails, loading, refetch: fetchRevisionTipDetails};
};

export default useGetRevisionTipDetails;

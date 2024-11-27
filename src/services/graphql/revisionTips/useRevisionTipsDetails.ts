import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionTip, RevisionTipsResponse} from '../../../types/graphql/revisionTips';
import {REQUEST_STATUSES} from '../../constants';

const useGetRevisionTipDetails = (id: number) => {
  const [revisionTipDetails, setRevisionTipDetails] = useState<RevisionTip>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionTipDetails = async () => {
    const response: RevisionTipsResponse['details'] = await fetch(GraphQL.getRevisionTipDetails, {id});

    if (response.revisionTips_Details?.status === REQUEST_STATUSES.success) {
      setRevisionTipDetails(response.revisionTips_Details?.item);
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

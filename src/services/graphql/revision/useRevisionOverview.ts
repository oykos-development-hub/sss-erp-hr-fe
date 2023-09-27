import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {RevisionParams} from '../../../types/graphql/revisionOverview';

const initialState = {items: [], total: 0, message: '', revisors: [], status: ''};

const useRevisionOverview = ({
  page,
  size,
  plan_id,
  internal_revision_subject_id,
  revision_type_id,
  revisor_id,
}: RevisionParams) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchRevision = async () => {
    const response = await GraphQL.revisionOverview(
      plan_id,
      internal_revision_subject_id,
      revision_type_id,
      revisor_id,
    );
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevision();
  }, [page, size, plan_id, internal_revision_subject_id, revision_type_id, revisor_id]);

  return {data, loading, refetch: fetchRevision};
};

export default useRevisionOverview;

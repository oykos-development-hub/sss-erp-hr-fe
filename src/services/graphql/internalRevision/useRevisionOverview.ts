import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {InternalRevisionsParams} from '../../../types/graphql/internalRevision';

const initialState = {items: [], total: 0, message: '', status: ''};

const useRevisionOverview = ({
  page,
  size,
  id,
  organization_unit_id,
  revisor_user_profile_id,
}: InternalRevisionsParams) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchInternalRevision = async () => {
    const internalRevision: any = await GraphQL.revisionOverview(
      page,
      size,
      id,
      organization_unit_id,
      revisor_user_profile_id,
    );
    setData(internalRevision);
    setLoading(false);
  };

  useEffect(() => {
    fetchInternalRevision();
  }, [page, size, id, organization_unit_id, revisor_user_profile_id]);

  return {data, loading, refetch: fetchInternalRevision};
};

export default useRevisionOverview;

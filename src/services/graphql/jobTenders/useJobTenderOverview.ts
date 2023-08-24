import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JobTendersListFilters} from '../../../screens/jobTenders';
import {JobTendersResponse} from '../../../types/graphql/jobTenders';

const initialState = {items: [], total: 0, message: '', status: ''};

export interface UseJobTendersParams extends JobTendersListFilters {
  id?: number;
  page: number;
  size: number;
}

const useJobTenderOverview = ({page, size, id, organization_unit_id, active, type_id}: UseJobTendersParams) => {
  const [data, setData] = useState<JobTendersResponse['data']['jobTenders_Overview']>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTenders = async () => {
    const jobTenders: any = await GraphQL.jobTenderOverview({
      page,
      size,
      id: id ? id : 0,
      organization_unit_id: organization_unit_id ? organization_unit_id.id : 0,
      active: active ? active.id : true,
      type_id: type_id?.id || 0,
    });
    setData(jobTenders);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenders();
  }, [page, size, id, active, organization_unit_id, type_id]);

  return {data, loading, refetch: fetchJobTenders};
};

export default useJobTenderOverview;

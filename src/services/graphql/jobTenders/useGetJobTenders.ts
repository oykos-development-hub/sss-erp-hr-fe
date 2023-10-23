import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JobTendersListFilters} from '../../../screens/jobTenders';
import {JobTender, JobTendersResponse} from '../../../types/graphql/jobTenders';
import useAppContext from '../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../constants';

export interface UseJobTendersParams extends JobTendersListFilters {
  id?: number;
  page: number;
  size: number;
}

const useGetJobTenders = ({page, size, id, organization_unit_id, active, type_id}: UseJobTendersParams) => {
  const [jobTenders, setJobTenders] = useState<JobTender[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJobTenders = async () => {
    const response: JobTendersResponse['get'] = await fetch(GraphQL.getJobTenders, {
      page,
      size,
      id: id ? id : 0,
      organization_unit_id: organization_unit_id ? organization_unit_id.id : 0,
      active: active ? active.id : true,
      type_id: type_id?.id || 0,
    });

    if (response.jobTenders_Overview.status === REQUEST_STATUSES.success) {
      setJobTenders(response.jobTenders_Overview.items ?? []);
      setTotal(response.jobTenders_Overview.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenders();
  }, [page, size, id, active, organization_unit_id, type_id]);

  return {jobTenders, loading, total, refetch: fetchJobTenders};
};

export default useGetJobTenders;

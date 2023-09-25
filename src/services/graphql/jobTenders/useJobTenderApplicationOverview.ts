import {useEffect, useState} from 'react';
import {ApplicationScreenFilters, JobTenderApplicationsParams} from '../../../types/graphql/jobTenders';
import {GraphQL} from '..';
const initialState = {items: [], total: 0, message: '', status: ''};

interface UseJobTenderApplicationsParams extends ApplicationScreenFilters {
  page: number;
  size: number;
  id: number;
  search: string;
}

const useJobTenderApplicationOverview = ({
  page,
  size,
  id,
  organization_unit_id,
  type_id,
  search,
}: UseJobTenderApplicationsParams) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTenderApplications = async () => {
    const jobTenderApplications: any = await GraphQL.jobTenderApplicationOverview({
      page,
      size,
      id,
      organization_unit_id: organization_unit_id ? organization_unit_id?.id : 0,
      type_id: type_id ? type_id?.id : 0,
      search,
    });
    setData(jobTenderApplications);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenderApplications();
  }, [page, size, id, organization_unit_id, type_id, search]);

  return {data, loading, refreshData: fetchJobTenderApplications};
};

export default useJobTenderApplicationOverview;

import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {QueryOptions} from '../../../types/queryOptions';
const initialState = {items: [], total: 0, message: '', status: ''};

interface UseJobTenderApplicationsParams {
  page: number;
  size: number;
  id?: number;
  search?: string;
  organization_unit_id?: DropdownDataNumber | null;
  type_id?: DropdownDataNumber | null;
  job_tender_id?: number;
}

const useJobTenderApplicationOverview = (
  {page, size, id, organization_unit_id, type_id, search, job_tender_id}: UseJobTenderApplicationsParams,
  options?: QueryOptions,
) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTenderApplications = async () => {
    const jobTenderApplications: any = await GraphQL.jobTenderApplicationOverview({
      page,
      size,
      id,
      organization_unit_id: organization_unit_id ? organization_unit_id?.id : null,
      type_id: type_id ? type_id?.id : 0,
      search,
      job_tender_id: job_tender_id || 0,
    });
    setData(jobTenderApplications);
    setLoading(false);
  };

  useEffect(() => {
    if (!options?.skip) {
      fetchJobTenderApplications();
    }
  }, [page, size, id, organization_unit_id, type_id, search, job_tender_id]);

  return {data, loading, refreshData: fetchJobTenderApplications};
};

export default useJobTenderApplicationOverview;

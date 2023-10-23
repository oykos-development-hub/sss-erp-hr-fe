import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  JobTenderApplication,
  JobTenderApplicationResponse,
  JobTenderApplicationsGetParams,
} from '../../../types/graphql/jobTenderApplications';
import {QueryOptions} from '../../../types/queryOptions';

const useGetJobTenderApplications = (params: JobTenderApplicationsGetParams, options?: QueryOptions) => {
  const [jobTenderApplications, setJobTenderApplications] = useState<JobTenderApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJobTenderApplications = async () => {
    const response: JobTenderApplicationResponse['get'] = await fetch(GraphQL.getJobTenderApplications, params);

    if (response.jobTender_Applications.status === 'success') {
      setJobTenderApplications(response.jobTender_Applications.items ?? []);
      setTotal(response.jobTender_Applications.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!options?.skip) {
      fetchJobTenderApplications();
    }
  }, [
    params.page,
    params.size,
    params.id,
    params.organization_unit_id,
    params.type_id,
    params.search,
    params.job_tender_id,
  ]);

  return {jobTenderApplications, total, loading, refetch: fetchJobTenderApplications};
};

export default useGetJobTenderApplications;

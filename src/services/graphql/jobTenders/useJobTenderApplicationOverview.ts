import {useEffect, useState} from 'react';
import {JobTenderApplicationsParams} from '../../../types/graphql/jobTenders';
import {GraphQL} from '..';
const initialState = {items: [], total: 0, message: '', status: ''};

const useJobTenderApplicationOverview = ({page, size, id = 0, job_tender_id = 0}: JobTenderApplicationsParams) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTenderApplications = async () => {
    const jobTenderApplications: any = await GraphQL.jobTenderApplicationOverview({
      page,
      size,
      id,
      job_tender_id,
    });
    setData(jobTenderApplications);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenderApplications();
  }, [page, size, id, job_tender_id]);

  return {data, loading, refreshData: fetchJobTenderApplications};
};

export default useJobTenderApplicationOverview;

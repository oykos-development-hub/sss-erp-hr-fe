import {useEffect, useMemo, useState} from 'react';
import {GraphQL} from '..';
import {JobTenderType, JobTenderTypeResponse} from '../../../types/graphql/useJobTendersTypes';
import useAppContext from '../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../constants';

const useGetJobTenderTypes = (search: string) => {
  const [jobTenderTypes, setJobTenderTypes] = useState<JobTenderType[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const options = useMemo(() => {
    return [
      {id: 0, title: 'Svi tipovi oglasa'},
      ...jobTenderTypes.map(type => {
        return {id: type.id, title: type.title};
      }),
    ];
  }, [jobTenderTypes]);

  const fetchJobTenderTypes = async () => {
    const response: JobTenderTypeResponse = await fetch(GraphQL.getJobTenderTypes, {search});

    if (response.jobTenderTypes.status === REQUEST_STATUSES.success) {
      setJobTenderTypes(jobTenderTypes);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenderTypes();
  }, [search]);

  return {jobTenderTypes, options, loading, refetch: fetchJobTenderTypes};
};

export default useGetJobTenderTypes;

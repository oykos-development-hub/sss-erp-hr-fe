import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {JobPosition, JobPositionResponse} from '../../../types/graphql/jobPositions';
import {QueryOptions} from '../../../types/queryOptions';

const useGetJobPositions = (search: string, options?: QueryOptions) => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJobPositions = async () => {
    const response: JobPositionResponse['get'] = await fetch(GraphQL.getJobPositions, {search});

    if (response.jobPositions?.status === 'success') {
      setJobPositions(response.jobPositions.items);
      setTotal(response.jobPositions.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!options?.skip) {
      fetchJobPositions();
    }
  }, [search]);

  return {jobPositions, loading, total, refetch: fetchJobPositions};
};

export default useGetJobPositions;

import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JobPositionResponse} from '../../../types/graphql/useJobPositions';

const initialState = {items: [], total: 0, message: '', status: ''};

const useJobPositionSearch = (search: string) => {
  const [positions, setData] = useState<JobPositionResponse>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTenderTypes = async () => {
    const jobPositions: any = await GraphQL.jobPositionSearch(search);
    setData(jobPositions);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenderTypes();
  }, [search]);

  return {positions, loading};
};

export default useJobPositionSearch;

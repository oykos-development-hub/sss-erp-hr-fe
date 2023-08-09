import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const initialState = {items: [], total: 0, message: '', status: ''};

const useJobPositionOverview = (search: string) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobPositions = async () => {
    const jobPositions: any = await GraphQL.jobPositionsGet(search);
    setData(jobPositions);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobPositions();
  }, [search]);

  return {data, loading, refetch: fetchJobPositions};
};

export default useJobPositionOverview;

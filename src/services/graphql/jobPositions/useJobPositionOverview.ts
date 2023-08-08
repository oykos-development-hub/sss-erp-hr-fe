import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const initialState = {items: [], total: 0, message: '', status: ''};

const useJobPositionOverview = (id?: number) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobPositions = async () => {
    const jobPositions = await GraphQL.jobPositionsGet(id);
    setData(jobPositions);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobPositions();
  }, [id]);

  return {data, loading, refetch: fetchJobPositions};
};

export default useJobPositionOverview;

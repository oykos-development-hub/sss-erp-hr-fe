import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const initialState = {items: [], total: 0, message: '', status: ''};

const useForeignerPermitOverview = (user_profile_id: number) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchForeignerPermits = async () => {
    const foreignerPermits: any = await GraphQL.foreignerPermits(user_profile_id);
    setData(foreignerPermits);
    setLoading(false);
  };

  useEffect(() => {
    fetchForeignerPermits();
  }, [user_profile_id]);

  return {data, loading, refetch: fetchForeignerPermits};
};

export default useForeignerPermitOverview;

import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const initialState = {items: [], total: 0, message: '', status: ''};

const useJobTenderDetails = (id: number) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTender = async () => {
    const jobTenders: any = await GraphQL.jobTenderDetails({
      id,
    });
    setData(jobTenders.items[0]);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTender();
  }, [id]);

  return {data, loading, refreshData: fetchJobTender};
};

export default useJobTenderDetails;

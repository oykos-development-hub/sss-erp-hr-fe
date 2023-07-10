import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const useSystematizationDetails = (id: number) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const getSystematizationDetails = async (onSuccess?: (item: any) => void) => {
    const response = await GraphQL.systematizationDetails(id);
    //Ask filip if we need array of items here
    const data = (response?.items && response?.items[0]) || null;

    setData(data);
    setLoading(false);
    onSuccess && onSuccess(data);
  };

  useEffect(() => {
    getSystematizationDetails();
  }, [id]);

  return {systematizationDetails: data, loading, refetch: getSystematizationDetails};
};

export default useSystematizationDetails;

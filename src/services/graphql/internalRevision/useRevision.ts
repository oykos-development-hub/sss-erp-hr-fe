import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const initialState = {item: {}, total: 0, message: '', status: ''};

const useRevisionDetails = (id: number) => {
  const [data, setData] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchInternalRevisionDetails = async () => {
    if (!id) {
      setData({item: []});
      return;
    }
    const internalRevisionDetails = await GraphQL.revisionDetails(id);
    setData(internalRevisionDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchInternalRevisionDetails();
  }, [id]);

  return {data, loading, refetch: fetchInternalRevisionDetails};
};

export default useRevisionDetails;

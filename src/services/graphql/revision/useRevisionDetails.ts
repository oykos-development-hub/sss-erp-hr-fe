import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const initialState = {items: [], total: 0, message: '', revisors: [], status: ''};

const useRevisionDetails = (id: number) => {
  const [revisionDetails, setRevisionDetails] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchRevisionDetails = async () => {
    const response = await GraphQL.revisionDetails(id);

    setRevisionDetails(response);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchRevisionDetails();
    }
  }, [id]);

  return {revisionDetails, loading, refetch: fetchRevisionDetails};
};

export default useRevisionDetails;

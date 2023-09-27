import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const useRevisionTipsDetails = (id: number) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const fetchRevisionTipsDetails = async () => {
    if (!id) {
      setData({item: []});
      return;
    }
    const revisionTipsDetails = await GraphQL.revisionTipsDetails(id);
    setData(revisionTipsDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionTipsDetails();
  }, [id]);

  return {data, loading, refetch: fetchRevisionTipsDetails};
};

export default useRevisionTipsDetails;

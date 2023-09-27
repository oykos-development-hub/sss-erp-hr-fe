import {useEffect, useState} from 'react';
import {GraphQL} from '..';

const useRevisionPlanDetails = (id: number) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const fetchRevisionPlanDetails = async () => {
    if (!id) {
      setData({item: []});
      return;
    }
    const revisionPlanDetails = await GraphQL.revisionPlanDetails(id);
    setData(revisionPlanDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionPlanDetails();
  }, [id]);

  return {data, loading, refetch: fetchRevisionPlanDetails};
};

export default useRevisionPlanDetails;

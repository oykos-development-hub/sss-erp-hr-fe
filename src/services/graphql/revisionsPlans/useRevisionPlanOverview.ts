import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {RevisionPlanItem, RevisionPlanParams} from '../../../types/graphql/revisionPlansOverview';

const useRevisionPlanOverview = ({page, size}: RevisionPlanParams) => {
  const [data, setData] = useState<RevisionPlanItem[]>();
  const [loading, setLoading] = useState(true);

  const fetchRevisionPlans = async () => {
    const response = await GraphQL.revisionPlansOverview();

    setData(response.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionPlans();
  }, [page, size]);

  return {data, loading, refetch: fetchRevisionPlans};
};

export default useRevisionPlanOverview;

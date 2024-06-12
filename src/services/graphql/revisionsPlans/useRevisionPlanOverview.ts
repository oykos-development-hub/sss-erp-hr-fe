import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionPlan, RevisionPlansResponse} from '../../../types/graphql/revisionPlans';
import {PaginationProps} from '../../../types/paginationParams';
import {REQUEST_STATUSES} from '../../constants';

const useGetRevisionPlans = ({page, size}: PaginationProps) => {
  const [revisionPlans, setRevisionPlans] = useState<RevisionPlan[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionPlans = async () => {
    const response: RevisionPlansResponse['get'] = await fetch(GraphQL.getRevisionPlans, {page, size});

    if (response.revisionPlans_Overview?.status === REQUEST_STATUSES.success) {
      setRevisionPlans(response.revisionPlans_Overview.items ?? []);
      setTotal(response.revisionPlans_Overview.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionPlans();
  }, [page, size]);

  return {revisionPlans, total, loading, refetch: fetchRevisionPlans};
};

export default useGetRevisionPlans;

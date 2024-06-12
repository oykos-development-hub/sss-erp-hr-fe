import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionPlan, RevisionPlansResponse} from '../../../types/graphql/revisionPlans';
import {REQUEST_STATUSES} from '../../constants';

const initialData = {
  id: 0,
  name: '',
  year: '',
};

const useGetRevisionPlanDetails = (id: number) => {
  const [revisionPlanDetails, setRevisionPlanDetails] = useState<RevisionPlan>(initialData);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionPlanDetails = async () => {
    setLoading(true);

    const response: RevisionPlansResponse['details'] = await fetch(GraphQL.getRevisionPlanDetails, {id});

    if (response.revisionPlans_Details?.status === REQUEST_STATUSES.success) {
      setRevisionPlanDetails(response.revisionPlans_Details.item);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchRevisionPlanDetails();
    }
  }, [id]);

  return {revisionPlanDetails, loading, refetch: fetchRevisionPlanDetails};
};

export default useGetRevisionPlanDetails;

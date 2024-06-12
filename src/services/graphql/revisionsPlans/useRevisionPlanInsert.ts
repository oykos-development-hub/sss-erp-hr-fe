import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionPlanInsertParams, RevisionPlansResponse} from '../../../types/graphql/revisionPlans';
import {REQUEST_STATUSES} from '../../constants';

const useInsertRevisionPlan = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertRevisionPlan = async (data: RevisionPlanInsertParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: RevisionPlansResponse['insert'] = await fetch(GraphQL.insertRevisionPlan, {data});

    if (response.revisionPlans_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertRevisionPlan};
};

export default useInsertRevisionPlan;

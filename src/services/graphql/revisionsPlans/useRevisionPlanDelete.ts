import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {RevisionPlansResponse} from '../../../types/graphql/revisionPlans';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteRevisionPlan = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteRevisionPlan = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: RevisionPlansResponse['delete'] = await fetch(GraphQL.deleteRevisionPlan, {id});

    if (response.revision_plans_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteRevisionPlan};
};

export default useDeleteRevisionPlan;

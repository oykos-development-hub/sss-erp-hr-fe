import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {JobTenderApplicationResponse} from '../../../types/graphql/jobTenderApplications';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteJobTenderApplication = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteJobTenderApplication = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: JobTenderApplicationResponse['delete'] = await fetch(GraphQL.deleteJobTenderApplication, {id});
    if (response.jobTenderApplications_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteJobTenderApplication};
};

export default useDeleteJobTenderApplication;

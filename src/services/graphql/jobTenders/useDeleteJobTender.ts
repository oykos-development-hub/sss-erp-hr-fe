import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {JobTendersResponse} from '../../../types/graphql/jobTenders';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteJobTender = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteJobTender = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: JobTendersResponse['delete'] = await fetch(GraphQL.deleteJobTender, {id});

    if (response.jobTenders_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteJobTender};
};

export default useDeleteJobTender;

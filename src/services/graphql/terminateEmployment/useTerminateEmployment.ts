import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {EmploymentTerminationResponse} from '../../../types/graphql/employmentTermination';
import {REQUEST_STATUSES} from '../../constants';

const useTerminateEmployment = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const terminateEmployment = async (
    {user_profile_id, file_id}: {user_profile_id: number; file_id: number},
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: EmploymentTerminationResponse = await fetch(GraphQL.terminateEmployment, {
      user_profile_id,
      file_id,
    });

    if (response.terminateEmployment?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, terminateEmployment};
};

export default useTerminateEmployment;

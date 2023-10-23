import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  JobTenderApplicationInsertParams,
  JobTenderApplicationResponse,
} from '../../../types/graphql/jobTenderApplications';
import {REQUEST_STATUSES} from '../../constants';

const useInsertJobTenderApplication = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertJobTenderApplication = async (
    data: JobTenderApplicationInsertParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: JobTenderApplicationResponse['insert'] = await fetch(GraphQL.insertJobTenderApplication, {data});
    if (response.jobTender_Applications_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertJobTenderApplication};
};

export default useInsertJobTenderApplication;

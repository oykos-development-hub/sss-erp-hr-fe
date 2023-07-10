import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {JobTenderApplicationInsertParams} from '../../../types/graphql/jobTenders';

const useJobTenderApplicationInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertJobTenderApplications = async (
    data: JobTenderApplicationInsertParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.jobTenderApplicationInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertJobTenderApplications};
};

export default useJobTenderApplicationInsert;

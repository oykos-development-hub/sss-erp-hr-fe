import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {JobTender, JobTendersResponse} from '../../../types/graphql/jobTenders';
import useAppContext from '../../../context/useAppContext';

const useInsertJobTender = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertJobTender = async (data: JobTender, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: JobTendersResponse['insert'] = await fetch(GraphQL.insertJobTender, {data});

    if (response.jobTenders_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertJobTender};
};

export default useInsertJobTender;

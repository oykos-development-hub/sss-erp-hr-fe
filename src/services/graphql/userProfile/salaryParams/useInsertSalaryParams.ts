import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileSalaryInsertParams, ProfileSalaryParamsResponse} from '../../../../types/graphql/salaryParams';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertSalaryParams = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertSalaryParams = async (data: ProfileSalaryInsertParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileSalaryParamsResponse['insert'] = await fetch(GraphQL.insertSalaryParams, {data});
    if (response.userProfileSalaryParams_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertSalaryParams};
};

export default useInsertSalaryParams;

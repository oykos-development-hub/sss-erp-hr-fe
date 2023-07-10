import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileGetSalaryParams} from '../../../../types/graphql/userProfileGetSalaryParams';

const useSalaryParamsInsert = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const insertSalaryParams = async (data: UserProfileGetSalaryParams) => {
    setLoading(true);
    const response = await GraphQL.salaryParamsInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertSalaryParams};
};

export default useSalaryParamsInsert;

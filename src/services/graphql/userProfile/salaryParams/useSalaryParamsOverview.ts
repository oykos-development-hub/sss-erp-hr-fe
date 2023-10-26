import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileSalaryParams, ProfileSalaryParamsResponse} from '../../../../types/graphql/salaryParams';
import {REQUEST_STATUSES} from '../../../constants';

const useGetSalaryParams = (id: number) => {
  const [salaryParams, setSalaryParams] = useState<ProfileSalaryParams>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchSalaryParams = async () => {
    const response: ProfileSalaryParamsResponse['get'] = await fetch(GraphQL.getSalaryParams, {user_profile_id: id});

    if (response.userProfile_SalaryParams?.status === REQUEST_STATUSES.success) {
      setSalaryParams(response.userProfile_SalaryParams?.items[0]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryParams();
  }, [id]);

  return {salaryParams, loading, refetch: fetchSalaryParams};
};

export default useGetSalaryParams;

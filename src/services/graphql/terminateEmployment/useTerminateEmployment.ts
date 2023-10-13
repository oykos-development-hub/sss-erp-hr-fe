import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GraphQL} from '..';

const useTerminateEmployment = (user_profile_id: number) => {
  const [terminateEmployment, setTerminateEmployment] = useState<any>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchTerminateEmployment = async () => {
    const response = await fetch(GraphQL.terminateEmployment, {user_profile_id});
    console.log(response);
    setTerminateEmployment(response);

    setLoading(false);
  };

  useEffect(() => {
    fetchTerminateEmployment();
  }, []);

  return {terminateEmployment, loading, refetch: fetchTerminateEmployment};
};

export default useTerminateEmployment;

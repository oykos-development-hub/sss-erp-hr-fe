import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {ForeignerPermit, ForeignerPermitResponse} from '../../../types/graphql/foreignerPermits';

const useGetForeignerPermits = (user_profile_id: number) => {
  const [foreignerPermits, setForeignerPermits] = useState<ForeignerPermit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchForeignerPermits = async () => {
    const response: ForeignerPermitResponse['get'] = await fetch(GraphQL.getForeignerPermits, {user_profile_id});

    if (response.userProfile_Foreigner) {
      setForeignerPermits(response.userProfile_Foreigner.items);
      setTotal(response.userProfile_Foreigner.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchForeignerPermits();
  }, [user_profile_id]);

  return {foreignerPermits, total, loading, refetch: fetchForeignerPermits};
};

export default useGetForeignerPermits;

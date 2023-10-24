import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileFamily, ProfileFamilyResponse} from '../../../../types/graphql/family';
import {REQUEST_STATUSES} from '../../../constants';

const useGetFamily = (id: number) => {
  const [family, setFamily] = useState<ProfileFamily[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchFamily = async () => {
    setLoading(true);

    const response: ProfileFamilyResponse['get'] = await fetch(GraphQL.getFamily, {user_profile_id: id});

    if (response.userProfile_Family?.status === REQUEST_STATUSES.success) {
      setFamily(response.userProfile_Family.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFamily();
  }, [id]);

  return {family, loading, refetch: fetchFamily};
};

export default useGetFamily;

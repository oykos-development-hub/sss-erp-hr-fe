import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileResolution, ProfileResolutionResponse} from '../../../../types/graphql/resolutions';
import {REQUEST_STATUSES} from '../../../constants';

const useGetResolutions = (id: number) => {
  const [resolutions, setResolutions] = useState<ProfileResolution[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchResolutions = async () => {
    setLoading(true);

    const response: ProfileResolutionResponse['get'] = await fetch(GraphQL.getResolutions, {user_profile_id: id});

    if (response.userProfile_Resolution?.status === REQUEST_STATUSES.success) {
      setResolutions(response.userProfile_Resolution.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchResolutions();
  }, [id]);

  return {resolutions, loading, refetch: fetchResolutions};
};

export default useGetResolutions;

import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileExperience, ProfileExperienceResponse} from '../../../../types/graphql/experience';
import {REQUEST_STATUSES} from '../../../constants';

const useGetExperience = (id: number) => {
  const [experience, setExperience] = useState<ProfileExperience[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchExperience = async () => {
    setLoading(true);

    const response: ProfileExperienceResponse['get'] = await fetch(GraphQL.getExperience, {user_profile_id: id});

    if (response.userProfile_Experience?.status === REQUEST_STATUSES.success) {
      setExperience(response.userProfile_Experience?.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchExperience();
  }, [id]);

  return {experience, loading, refetch: fetchExperience};
};

export default useGetExperience;

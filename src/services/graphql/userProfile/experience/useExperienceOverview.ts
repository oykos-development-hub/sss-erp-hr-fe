import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileExperience} from '../../../../types/graphql/userProfileGetExperienceTypes';

const useExperienceOverview = (id: number) => {
  const [userExperience, setUserExperience] = useState<UserProfileExperience[]>();
  const [loading, setLoading] = useState(true);

  const fetchUserExperience = async () => {
    const response = await GraphQL.experienceOverview(id);
    const experience = response?.items;

    setUserExperience(experience);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserExperience();
  }, [id]);

  return {experienceData: userExperience, loading, refetchData: fetchUserExperience};
};

export default useExperienceOverview;

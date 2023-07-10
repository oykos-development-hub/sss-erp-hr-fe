import {useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileExperience} from '../../../../types/graphql/userProfileGetExperienceTypes';

const useExperienceInsert = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const insertProfileExperience = async (data: UserProfileExperience) => {
    setLoading(true);
    const response = await GraphQL.experienceInsert(data);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProfileExperience};
};

export default useExperienceInsert;

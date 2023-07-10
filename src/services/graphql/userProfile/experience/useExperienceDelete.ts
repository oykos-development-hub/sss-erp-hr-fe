import {useState} from 'react';
import {GraphQL} from '../..';

const useExperienceDelete = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const deleteUserProfileExperience = async (id: number) => {
    setLoading(true);
    const response = await GraphQL.experienceDelete(id);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteUserProfileExperience};
};

export default useExperienceDelete;

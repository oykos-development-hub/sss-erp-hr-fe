import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';
import {ProfileExperience, ProfileExperienceResponse} from '../../../../types/graphql/experience.ts';
import {REQUEST_STATUSES} from '../../../constants.ts';

const useInsertExperiences = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertExperiences = async (data: {data: ProfileExperience[]}, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);

    const response: ProfileExperienceResponse['insertMultiple'] = await fetch(GraphQL.insertExperiences, data);
    if (response.userProfile_Experiences_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertExperiences};
};

export default useInsertExperiences;

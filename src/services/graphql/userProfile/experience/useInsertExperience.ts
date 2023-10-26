import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileExperience, ProfileExperienceResponse} from '../../../../types/graphql/experience';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertExperience = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertExperience = async (data: ProfileExperience, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileExperienceResponse['insert'] = await fetch(GraphQL.insertExperience, {data});

    if (response.userProfile_Experience_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertExperience};
};

export default useInsertExperience;

import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileExperienceResponse} from '../../../../types/graphql/experience';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteExperience = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteExperience = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileExperienceResponse['delete'] = await fetch(GraphQL.deleteExperience, {id});

    if (response.userProfile_Experience_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteExperience};
};

export default useDeleteExperience;

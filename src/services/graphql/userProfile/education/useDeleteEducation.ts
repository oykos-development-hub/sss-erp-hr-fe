import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileEducationResponse} from '../../../../types/graphql/education';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteEducation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteEducation = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileEducationResponse['delete'] = await fetch(GraphQL.deleteEducation, {id});

    if (response.userProfile_Education_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteEducation};
};

export default useDeleteEducation;

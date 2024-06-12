import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileResolutionResponse} from '../../../../types/graphql/resolutions';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteResolution = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteResolution = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileResolutionResponse['delete'] = await fetch(GraphQL.deleteResolution, {id});

    if (response.userProfileResolution_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteResolution};
};

export default useDeleteResolution;

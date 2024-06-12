import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileFamilyResponse} from '../../../../types/graphql/family';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteFamily = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteFamily = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileFamilyResponse['delete'] = await fetch(GraphQL.deleteFamily, {id});

    if (response.userProfileFamily_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFamily};
};

export default useDeleteFamily;

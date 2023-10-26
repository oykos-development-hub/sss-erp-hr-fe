import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileFamily, ProfileFamilyResponse} from '../../../../types/graphql/family';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertFamily = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertFamily = async (data: ProfileFamily, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileFamilyResponse['insert'] = await fetch(GraphQL.insertFamily, {data});

    if (response.userProfile_Family_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertFamily};
};

export default useInsertFamily;

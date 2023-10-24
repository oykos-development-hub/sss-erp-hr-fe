import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileResolutionParams, ProfileResolutionResponse} from '../../../../types/graphql/resolutions';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertResolution = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertResolution = async (data: ProfileResolutionParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: ProfileResolutionResponse['insert'] = await fetch(GraphQL.insertResolution, {data});
    if (response.userProfile_Resolution_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertResolution};
};

export default useInsertResolution;

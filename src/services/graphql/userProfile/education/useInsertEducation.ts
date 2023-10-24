import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {ProfileEducationItem, ProfileEducationResponse} from '../../../../types/graphql/userProfileEducation';
import useAppContext from '../../../../context/useAppContext';

const useInsertEducation = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertEducation = async (data: ProfileEducationItem, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: ProfileEducationResponse['insert'] = await fetch(GraphQL.insertEducation, {data});

    if (response.userProfile_Education_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertEducation};
};

export default useInsertEducation;

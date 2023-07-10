import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {UserProfileEducationItem} from '../../../../types/graphql/userProfileGetEducation';

const useEducationInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertEducation = async (data: UserProfileEducationItem, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.educationInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertEducation};
};

export default useEducationInsert;

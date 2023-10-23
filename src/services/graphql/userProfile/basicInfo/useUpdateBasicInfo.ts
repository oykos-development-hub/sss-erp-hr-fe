import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {
  UserProfileBasicInfoFormValues,
  UserProfileBasicInfoResponse,
} from '../../../../types/graphql/userProfileBasicInfo';
import {REQUEST_STATUSES} from '../../../constants';

const useUpdateBasicInfo = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const updateBasicInfo = async (
    data: UserProfileBasicInfoFormValues,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: UserProfileBasicInfoResponse['update'] = await fetch(GraphQL.updateBasicInfo, {data});

    if (response.userProfile_Update?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, updateBasicInfo};
};

export default useUpdateBasicInfo;

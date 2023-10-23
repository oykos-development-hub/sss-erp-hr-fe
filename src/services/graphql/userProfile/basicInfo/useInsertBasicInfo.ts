import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {
  UserProfileBasicInfoFormValues,
  UserProfileBasicInfoResponse,
} from '../../../../types/graphql/userProfileBasicInfo';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertBasicInfo = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertBasicInfo = async (
    data: UserProfileBasicInfoFormValues,
    onSuccess?: (userId: number) => void,
    onError?: (response: any) => void,
  ) => {
    setLoading(true);

    const response: UserProfileBasicInfoResponse['insert'] = await fetch(GraphQL.insertBasicInfo, {data});

    if (response.userProfile_Basic_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.userProfile_Basic_Insert.item?.id || 0);
    } else {
      onError && onError(response);
    }

    setLoading(false);
  };

  return {loading, insertBasicInfo};
};

export default useInsertBasicInfo;

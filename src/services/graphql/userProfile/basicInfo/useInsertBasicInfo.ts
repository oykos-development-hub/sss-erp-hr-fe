import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileBasicInfoFormValues, ProfileBasicInfoResponse} from '../../../../types/graphql/basicInfo';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertBasicInfo = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertBasicInfo = async (
    data: ProfileBasicInfoFormValues,
    onSuccess?: (userId: number) => void,
    onError?: (response: any) => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: ProfileBasicInfoResponse['insert'] = await fetch(GraphQL.insertBasicInfo, {data});

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

import {useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {AbsenceParams, AbsentResponse} from '../../../../types/graphql/absents';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertAbsence = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertAbsence = async (data: AbsenceParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: AbsentResponse['insert'] = await fetch(GraphQL.insertAbsence, {data});

    if (response.userProfile_Absent_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertAbsence};
};

export default useInsertAbsence;

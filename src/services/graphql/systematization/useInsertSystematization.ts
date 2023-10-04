import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  InsertSystematizationParams,
  SystematizationType,
  SystematizationsResponse,
} from '../../../types/graphql/systematizationsTypes';
import {REQUEST_STATUSES} from '../../constants';

const useInsertSystematization = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertSystematization = async (
    data: InsertSystematizationParams,
    onSuccess?: (response: SystematizationType) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: SystematizationsResponse['insert'] = await fetch(GraphQL.insertSystematization, {data});

    if (response.systematizations_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.systematizations_Insert.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: insertSystematization};
};

export default useInsertSystematization;

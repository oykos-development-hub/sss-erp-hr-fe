import {useState} from 'react';
import {GraphQL} from '..';
import {JobPositionInOrganizationUnitInsert} from '../../../types/graphql/jobPositionInOrganizationUnitInsertTypes';
import {REQUEST_STATUSES} from '../../constants';

const useOrganizationUnitJobPositionInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertJobPosition = async (
    data: JobPositionInOrganizationUnitInsert,
    onSuccess?: (item?: JobPositionInOrganizationUnitInsert) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response = await GraphQL.jobPositionInOrganizationUnitInsert(data);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: insertJobPosition};
};

export default useOrganizationUnitJobPositionInsert;

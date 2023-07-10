import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {OrganizationUnit} from '../../../types/graphql/organizationUnitsTypes';

const useOrganizationUnitInsert = (onSuccess?: () => void, onError?: () => void) => {
  const [loading, setLoading] = useState(false);

  const insertOrganisation = async (data: OrganizationUnit) => {
    setLoading(true);
    const response = await GraphQL.organizationUnitInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };
  return {loading, mutate: insertOrganisation, success: onSuccess, error: onError};
};

export default useOrganizationUnitInsert;

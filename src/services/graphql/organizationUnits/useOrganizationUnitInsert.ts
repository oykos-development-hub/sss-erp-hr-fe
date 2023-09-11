import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {OrganizationUnit} from '../../../types/graphql/organizationUnitsTypes';

const useOrganizationUnitInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertOrganisation = async (data: OrganizationUnit, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.organizationUnitInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };
  return {loading, mutate: insertOrganisation};
};

export default useOrganizationUnitInsert;

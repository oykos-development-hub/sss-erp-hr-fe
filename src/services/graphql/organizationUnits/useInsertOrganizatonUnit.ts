import {useState} from 'react';
import {REQUEST_STATUSES} from '../../constants';
import {OrganizationUnit, OrganizationUnitsResponse} from '../../../types/graphql/organizationUnits';
import useAppContext from '../../../context/useAppContext';

const useInsertOrganizationUnit = () => {
  const [loading, setLoading] = useState(false);

  const {
    fetch,
    graphQl: {insertOrganizationUnit},
  } = useAppContext();

  const insertOrgUnit = async (data: OrganizationUnit, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: OrganizationUnitsResponse['insert'] = await fetch(insertOrganizationUnit, {data});

    if (response.organizationUnits_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: insertOrgUnit};
};

export default useInsertOrganizationUnit;

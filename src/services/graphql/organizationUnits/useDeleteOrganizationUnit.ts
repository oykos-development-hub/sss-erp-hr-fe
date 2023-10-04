import {useState} from 'react';
import {REQUEST_STATUSES} from '../../constants';
import useAppContext from '../../../context/useAppContext';
import {OrganizationUnitsResponse} from '../../../types/graphql/organizationUnits';

const useDeleteOrganizationUnit = () => {
  const [loading, setLoading] = useState(false);

  const {
    fetch,
    graphQl: {deleteOrganizationUnit},
  } = useAppContext();

  const deleteOrganizationUnitFunc = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: OrganizationUnitsResponse['delete'] = await fetch(deleteOrganizationUnit, {id});

    if (response.organizationUnits_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: deleteOrganizationUnitFunc};
};

export default useDeleteOrganizationUnit;

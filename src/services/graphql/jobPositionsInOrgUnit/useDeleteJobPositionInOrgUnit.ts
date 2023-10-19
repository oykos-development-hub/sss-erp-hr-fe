import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {JobPositionsInOrgUnitResponse} from '../../../types/graphql/jobPositions';
import {REQUEST_STATUSES} from '../../constants';

const useDeleteJobPositionInOrgUnit = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteJobPositionInOrganizationUnit = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: JobPositionsInOrgUnitResponse['delete'] = await fetch(GraphQL.deleteJobPositionInOrgUnit, {id});

    if (response.jobPositionInOrganizationUnit_Delete?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: deleteJobPositionInOrganizationUnit};
};

export default useDeleteJobPositionInOrgUnit;

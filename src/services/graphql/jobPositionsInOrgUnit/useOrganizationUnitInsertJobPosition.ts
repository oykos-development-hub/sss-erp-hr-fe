import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {JobPositionInOrganizationUnitInsert} from '../../../types/graphql/jobPositionInOrganizationUnitInsertTypes';
import {JobPositionInOrgUnitParams, JobPositionsInOrgUnitResponse} from '../../../types/graphql/jobPositions';
import {REQUEST_STATUSES} from '../../constants';

const useInsertJobPositionInOrgUnit = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertJobPositionInOrgUnit = async (
    data: JobPositionInOrganizationUnitInsert,
    onSuccess?: (item?: JobPositionInOrgUnitParams) => void,
    onError?: () => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: JobPositionsInOrgUnitResponse['insert'] = await fetch(GraphQL.insertJobPositionInOrgUnit, {
      data,
    });

    if (response.jobPositionInOrganizationUnit_Insert?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response.jobPositionInOrganizationUnit_Insert.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: insertJobPositionInOrgUnit};
};

export default useInsertJobPositionInOrgUnit;

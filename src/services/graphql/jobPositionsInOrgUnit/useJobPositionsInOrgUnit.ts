import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {JobPositionsInOrgUnitResponse} from '../../../types/graphql/jobPositions';
import {QueryOptions} from '../../../types/queryOptions';
import {REQUEST_STATUSES} from '../../constants';

const useGetJobPositionsInOrgUnit = (organization_unit_id?: number, options?: QueryOptions) => {
  const [jobPositionsInOrgUnit, setJobPositionsInOrgUnit] = useState<DropdownDataNumber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJobPositionsInOrgUnit = async () => {
    const response: JobPositionsInOrgUnitResponse['get'] = await fetch(GraphQL.getJobPositionsInOrgUnit, {
      organization_unit_id,
    });

    if (response.jobPositionsOrganizationUnit?.status === REQUEST_STATUSES.success) {
      setJobPositionsInOrgUnit(response.jobPositionsOrganizationUnit.items ?? []);
      setTotal(response.jobPositionsOrganizationUnit.total ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (options?.skip) {
      fetchJobPositionsInOrgUnit();
    }
  }, [organization_unit_id]);

  return {jobPositionsInOrgUnit, total, loading, refetch: fetchJobPositionsInOrgUnit};
};

export default useGetJobPositionsInOrgUnit;

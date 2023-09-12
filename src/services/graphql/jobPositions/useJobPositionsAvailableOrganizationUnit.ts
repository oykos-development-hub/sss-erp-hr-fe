import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JobPositionResponse} from '../../../types/graphql/useJobPositions';
import {DropdownDataNumber} from '../../../types/dropdownData';

const useJobPositionsAvailableOrganizationUnit = (
  organization_unit_id?: number,
  office_unit_id?: number,
  onSuccess?: () => void,
) => {
  const [positions, setData] = useState<DropdownDataNumber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobTenderTypes = async () => {
    const jobPositions: any = await GraphQL.jobPositionsAvailableOrganizationUnit(organization_unit_id, office_unit_id);
    setData(jobPositions?.items || []);
    setLoading(false);
    onSuccess && onSuccess();
  };

  useEffect(() => {
    fetchJobTenderTypes();
  }, [office_unit_id]);

  return {positions, loading};
};

export default useJobPositionsAvailableOrganizationUnit;

import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {JobPositionResponse} from '../../../types/graphql/useJobPositions';

const initialState = {items: [], total: 0, message: '', status: ''};

const useJobPositionsOrganizationUnit = (organization_unit_id?: number) => {
  const [positions, setData] = useState<JobPositionResponse>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchJobTenderTypes = async () => {
    const jobPositions: any = await GraphQL.jobPositionsOrganizationUnit(organization_unit_id);
    setData(jobPositions);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenderTypes();
  }, [organization_unit_id]);

  return {positions, loading};
};

export default useJobPositionsOrganizationUnit;

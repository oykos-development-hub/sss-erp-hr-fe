import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {JobPositionResponse} from '../../../types/graphql/jobPositions';
import {QueryOptions} from '../../../types/queryOptions';

const useGetAvailableJobPositions = (
  organization_unit_id?: number,
  office_unit_id?: number,
  options?: QueryOptions,
) => {
  const [availableJobPositions, setAvailableJobPositions] = useState<DropdownDataNumber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchAvailableJobPositions = async () => {
    setLoading(true);

    const response: JobPositionResponse['getAvailable'] = await fetch(GraphQL.getAvailableJobPositions, {
      organization_unit_id,
      office_unit_id,
    });

    if (response.jobPositionsAvailableInOrganizationUnit?.status === 'success') {
      setAvailableJobPositions(response.jobPositionsAvailableInOrganizationUnit.items ?? []);
      setTotal(response.jobPositionsAvailableInOrganizationUnit.total ?? 0);

      if (options?.onSuccess) {
        options.onSuccess();
      }
    } else {
      if (options?.onError) {
        options.onError();
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!options?.skip) {
      fetchAvailableJobPositions();
    }
  }, [office_unit_id]);

  return {availableJobPositions, total, loading, refetch: fetchAvailableJobPositions};
};

export default useGetAvailableJobPositions;

import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {
  GetOrganizationUnitsOptions,
  GetOrganizationUnitsParams,
  OrganizationUnit,
  OrganizationUnitsResponse,
} from '../../../types/graphql/organizationUnits';

const useGetOrganizationUnits = (data?: GetOrganizationUnitsParams, options?: GetOrganizationUnitsOptions) => {
  const [items, setItems] = useState<OrganizationUnit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    fetch,
    graphQl: {getOrganizationUnits},
  } = useAppContext();

  const fetchOrganizationUnits = async () => {
    setLoading(true);

    const response: OrganizationUnitsResponse['get'] = await fetch(getOrganizationUnits, data);

    if (response.organizationUnits) {
      setItems(response.organizationUnits.items);
      setTotal(response.organizationUnits.total ?? 0);
    }

    setLoading(false);
  };

  const organizationUnits = useMemo(() => items.filter(unit => !unit.parent_id), [items]);
  const departments = useMemo(() => items.filter(unit => unit.parent_id), [items]);

  if (options?.allOption) {
    departments.unshift({id: 0, title: 'Sva odjeljenja'} as OrganizationUnit);
    organizationUnits.unshift({id: 0, title: 'Sve organizacione jedinice'} as OrganizationUnit);
  }

  useEffect(() => {
    fetchOrganizationUnits();
  }, [data?.page, data?.size, data?.search]);

  return {
    organizationUnits,
    departments,
    refetch: fetchOrganizationUnits,
    total,
    loading,
  };
};

export default useGetOrganizationUnits;

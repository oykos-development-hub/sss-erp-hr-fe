import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  GetSystematizationsParams,
  SystematizationType,
  SystematizationsResponse,
} from '../../../types/graphql/systematizationsTypes';

const useGetSystematizations = ({page, size, id, organization_unit_id, year, search}: GetSystematizationsParams) => {
  const [systematizations, setSystematization] = useState<SystematizationType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch, contextMain} = useAppContext();
  const isAdmin = contextMain.role_id === 1;
  const fetchSystematizations = async () => {
    setLoading(true);
    const orgUnitID = isAdmin ? organization_unit_id : contextMain.organization_unit.id;
    const response: SystematizationsResponse['get'] = await fetch(GraphQL.getSystematizations, {
      page,
      size,
      id,
      organization_unit_id: orgUnitID,
      year,
      search,
    });

    if (response.systematizations_Overview) {
      setSystematization(response.systematizations_Overview.items);
      setTotal(response.systematizations_Overview.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSystematizations();
  }, [page, id, organization_unit_id, year, search]);

  return {systematizations, total, loading, refetch: fetchSystematizations};
};

export default useGetSystematizations;

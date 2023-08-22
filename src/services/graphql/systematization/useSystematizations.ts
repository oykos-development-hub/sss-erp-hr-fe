import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {SystematizationsParams, SystematizationType} from '../../../types/graphql/systematizationsTypes';

const useSystematizationOverview = ({page, size, id, organization_unit_id, year, search}: SystematizationsParams) => {
  const [data, setData] = useState<SystematizationType[]>();
  const [loading, setLoading] = useState(true);

  const fetchSystematizations = async () => {
    const systematizations: any = await GraphQL.systematizationOverview({
      page,
      size,
      id,
      organization_unit_id,
      year,
      search,
    });

    setData(systematizations?.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchSystematizations();
  }, [page, size, id, organization_unit_id, year, search]);

  return {data, loading, refetch: fetchSystematizations};
};

export default useSystematizationOverview;

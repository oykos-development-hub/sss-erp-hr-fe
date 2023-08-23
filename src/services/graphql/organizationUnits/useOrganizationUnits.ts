import {useEffect, useMemo, useState} from 'react';
import {GraphQL} from '..';
import {OrganizationUnit} from '../../../types/graphql/organizationUnitsTypes';
import {REQUEST_STATUSES} from '../../constants';

const useOrganizationUnitOverview = (props?: any, notParent?: boolean) => {
  const [organizationUnits, setOrganizationUnits] = useState<OrganizationUnit[]>([]);
  const organizationUnitsList = useMemo(() => {
    return [
      {id: 0, title: 'Sve organizacione jedinice'},
      ...organizationUnits.map(unit => {
        return {id: unit.id, title: unit.title};
      }),
    ];
  }, [organizationUnits]);

  const fetchOrganizationUnits = async () => {
    GraphQL?.organizationUnits().then(response => {
      if (response?.status === REQUEST_STATUSES.success) {
        delete response.message;
        delete response.status;
        if (notParent) response.items = response.items?.filter(item => !item.parent_id);
        setOrganizationUnits(response.items as OrganizationUnit[]);
      } else {
        alert(`Login failed due to error - ${response.message}`);
      }
    });
  };

  useEffect(() => {
    fetchOrganizationUnits();
  }, [props]);

  return {organizationUnits, organizationUnitsList, fetch: fetchOrganizationUnits};
};

export default useOrganizationUnitOverview;

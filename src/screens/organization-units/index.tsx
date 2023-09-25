import React, {useEffect, useState} from 'react';
import {ScreenProps} from '../../types/screen-props';
import {REQUEST_STATUSES} from '../../services/constants';
import {OrganizationUnit} from '../../types/graphql/organizationUnitsTypes';
import {Typography} from 'client-library';
import {GraphQL} from '../../services/graphql';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';

export const OrganizationUnitsScreen: React.FC<ScreenProps> = ({context}) => {
  const [organizationUnits, setOrganizationUnits] = useState<OrganizationUnit[]>([]);

  useEffect(() => {
    GraphQL.organizationUnits().then(response => {
      if (response?.status === REQUEST_STATUSES.success) {
        delete response.message;
        delete response.status;
        setOrganizationUnits(response.items as OrganizationUnit[]);
      } else {
        alert(`Login failed due to error - ${response.message}`);
      }
    });
  }, []);

  return (
    <ScreenWrapper context={context}>
      <Typography content="Organization Units" variant="h1" />
      <ul>
        {!!organizationUnits.length &&
          organizationUnits.map((item: OrganizationUnit) => (
            <li key={`organization-unit-${item?.id}`}>
              <Typography content={item.title} variant="bodyMedium" />
            </li>
          ))}
      </ul>
    </ScreenWrapper>
  );
};

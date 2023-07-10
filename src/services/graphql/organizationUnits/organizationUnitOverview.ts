import {GraphQL} from '..';
import {OrganizationUnitsResponse} from '../../../types/graphql/organizationUnitsTypes';

const organizationUnitOverview = async (): Promise<OrganizationUnitsResponse['data']['organizationUnits']> => {
  const queryIdentifier = 'organizationUnits';
  const response = await GraphQL.fetch(`
        query {
          ${queryIdentifier} {
              message
              status
              items {
                  id,
                  parent_id,
                  number_of_judges,
                  title,
                  abbreviation,
                  color,
                  icon,
                  folder_id
              }
          }
        }
    `);

  return response?.data[queryIdentifier] || {};
};

export default organizationUnitOverview;

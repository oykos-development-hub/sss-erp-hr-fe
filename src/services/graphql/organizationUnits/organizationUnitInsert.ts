import {GraphQL} from '..';
import {OrganizationUnit, OrganizationUnitInsertResponse} from '../../../types/graphql/organizationUnitsTypes';

const organizationUnitInsert = async (
  data: OrganizationUnit,
): Promise<OrganizationUnitInsertResponse['data']['organizationUnits_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    organizationUnits_Insert(data: {
        id: ${data.id},
        parent_id: ${data.parent_id},
        number_of_judges: ${data.number_of_judges},
        title: "${data.title}",
        abbreviation: "${data.abbreviation}",
        description: "${data.description}",
        address: "${data.address}",
        color: "${data.color}",
        folder_id: ${data.folder_id},
        icon: "${data.icon}",
      }
      ) {
        message
        status
        item {
          id
          parent_id
          number_of_judges
          title
          abbreviation
          description
          address
          color
          folder_id
          icon
        }
      }
    }`);
  return response?.data?.organizationUnits_Insert || {};
};

export default organizationUnitInsert;

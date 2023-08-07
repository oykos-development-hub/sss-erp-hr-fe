import {GraphQL} from '..';
import {OrganizationUnit, OrganizationUnitInsertResponse} from '../../../types/graphql/organizationUnitsTypes';

const organizationUnitInsert = async (
  data: OrganizationUnit,
): Promise<OrganizationUnitInsertResponse['data']['organizationUnits_Insert']> => {
  const mutation = `mutation($data: OrganizationUnitInsertMutation!) {
    organizationUnits_Insert(data: $data) {
        message
        status
        item {
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
}`;
  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.organizationUnits_Insert || {};
};

export default organizationUnitInsert;

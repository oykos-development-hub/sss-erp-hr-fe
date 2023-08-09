import {GraphQL} from '..';
import {OrganizationUnitsResponse} from '../../../types/graphql/organizationUnitsTypes';

const organizationUnitOverview = async (): Promise<OrganizationUnitsResponse['data']['organizationUnits']> => {
  const query = `query OrganizationUnitsOverview($page: Int, $size: Int) {
        organizationUnits(page: $page, size: $size) {
            message
            status
            total
            items {
                id,
                parent_id,
                number_of_judges,
                title,
                abbreviation,
                description,
                address,
                color,
                icon,
                children {
                    id,
                    parent_id,
                    number_of_judges,
                    title,
                    abbreviation,
                    description,
                    address,
                    color,
                    icon,
                    folder_id
                }
                folder_id
            }
        }
    }`;
  const response = await GraphQL.fetch(query, {});
  return response?.data?.organizationUnits || {};
};

export default organizationUnitOverview;

import {GraphQL} from '..';
import {SettingsDropdownParams, SettingsDropdownResponse} from '../../../types/graphql/settingsDropdownType';
import {} from '../../../types/graphql/systematizationsTypes';

const settingsDropdownOverview = async ({
  entity = '',
  page,
  size,
  id = 0,
}: SettingsDropdownParams): Promise<SettingsDropdownResponse['data']['settingsDropdown_Overview']> => {
  const query = `query SettingsDropdownOverview($search: String, $id: Int, $entity: String!, $page: Int, $size: Int) {
        settingsDropdown_Overview(search: $search, page: $page, size: $size, id: $id, entity: $entity) {
            status 
            message
            total
            items {
                id
                title
                entity
                value
                description
                abbreviation
                color
                icon
            }
        }
    }`;
  const response = await GraphQL.fetch(query, {page, size, id, entity});

  return response?.data?.settingsDropdown_Overview || {};
};

export default settingsDropdownOverview;

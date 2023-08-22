import {GraphQL} from '..';
import {SystematizationsParams, SystematizationsResponse} from '../../../types/graphql/systematizationsTypes';

const systematizationOverview = async ({
  page,
  size,
  id,
  organization_unit_id,
  year,
  search,
}: SystematizationsParams): Promise<SystematizationsResponse['data']['systematizations_Overview']> => {
  const query = `query SystematizationOverview($page: Int, $size: Int, $id: Int, $organization_unit_id: Int, $year: String, $search: String){
      systematizations_Overview(
      page:$page,
      size:$size, 
      id: $id, 
      organization_unit_id: $organization_unit_id,
      year:$year,
      search: $search 
      ) {
          message
          status
          items {
              id 
              organization_unit { 
                  id 
                  title
              }
              description
              serial_number 
              active 
              date_of_activation 
              created_at 
              updated_at    
          } 
          total
      }
    }`;

  const response = await GraphQL.fetch(query, {page, size, id, organization_unit_id, year, search});
  return response?.data?.systematizations_Overview || {};
};

export default systematizationOverview;

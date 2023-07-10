import {GraphQL} from '..';
import {SystematizationsParams, SystematizationsResponse} from '../../../types/graphql/systematizationsTypes';

const systematizationOverview = async ({
  page,
  size,
  id = 0,
  organization_unit_id = 0,
}: SystematizationsParams): Promise<SystematizationsResponse['data']['systematizations_Overview']> => {
  const response = await GraphQL.fetch(`query {
    systematizations_Overview(page: ${page}, size: ${size}, id: ${id}, organization_unit_id: ${organization_unit_id}) {
      status 
      message
      total 
      items {
          id 
          user_profile { 
             id 
             title 
          } 
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
    }
}`);

  return response?.data?.systematizations_Overview || {};
};

export default systematizationOverview;

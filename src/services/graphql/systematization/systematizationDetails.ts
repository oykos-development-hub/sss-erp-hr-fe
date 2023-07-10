import {GraphQL} from '..';
import {SystematizationGetDetailsResponse} from '../../../types/graphql/systematizationsGetDetailsTypes';

const systematizationDetails = async (
  id: number,
): Promise<SystematizationGetDetailsResponse['data']['systematization_Details']> => {
  const response = await GraphQL.fetch(`query {
    systematization_Details(id: ${id}) {
      status 
      message 
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
          sectors {
              id
              parent_id
              title
              abbreviation
              color
              icon
              job_positions {
                  id
                  job_position {
                      title
                      id
                  }
                  description
                  serial_number
                  requirements
                  available_slots
                  employees {
                      title
                      user_profile_id
                      id
                  }
              }
          }
      } 
    }
}`);

  return response?.data?.systematization_Details || {};
};

export default systematizationDetails;

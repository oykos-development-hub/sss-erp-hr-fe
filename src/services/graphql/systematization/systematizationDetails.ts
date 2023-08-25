import {GraphQL} from '..';
import {SystematizationGetDetailsResponse} from '../../../types/graphql/systematizationsGetDetailsTypes';

const systematizationDetails = async (
  id: number,
): Promise<SystematizationGetDetailsResponse['data']['systematization_Details']> => {
  const query = `query SystematizationDetails($id: Int) {
    systematization_Details(id: $id) {
        status 
        message 
        item {
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
                job_positions_organization_units {
                    id
                    job_positions {
                        title
                        id
                    }
                    description
                    serial_number
                    requirements
                    available_slots
                    employees {
                        title
                        id
                    }
                }
            }
            active_employees {
                id
                full_name
                job_position{
                    id
                    title
                }
                sector
            }
        } 
    } 
}`;

  const response = await GraphQL.fetch(query, {id});

  return response?.data?.systematization_Details || {};
};

export default systematizationDetails;

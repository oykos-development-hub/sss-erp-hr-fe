import {GraphQL} from '..';
import {
  SystematizationsInsertParams,
  SystematizationsInsertResponse,
} from '../../../types/graphql/systematizationsInsertTypes';

const systematizationInsert = async (
  data: SystematizationsInsertParams,
): Promise<SystematizationsInsertResponse['data']['systematizations_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    systematizations_Insert(data: {
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      organization_unit_id: ${data.organization_unit_id},
      description: "${data.description}",
      serial_number: "${data.serial_number}",
      active: ${data.active},
      date_of_activation: "${data.date_of_activation}",
      file_id: ${data.file_id},
    }
    ) {
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
                        id
                    }
                }
            }
        } 
  }
}`);

  return response?.data?.systematizations_Insert || {};
};

export default systematizationInsert;

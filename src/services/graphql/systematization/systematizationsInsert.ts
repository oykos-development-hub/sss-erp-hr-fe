import {GraphQL} from '..';
import {
  SystematizationsInsertParams,
  SystematizationsInsertResponse,
} from '../../../types/graphql/systematizationsInsertTypes';

const systematizationInsert = async (
  data: SystematizationsInsertParams,
): Promise<SystematizationsInsertResponse['data']['systematizations_Insert']> => {
  const mutation = `mutation($data: SystematizationInsertMutation!) {
      systematizations_Insert(data: $data) {
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
              file_id
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
          } 
      } 
  }`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.systematizations_Insert || {};
};

export default systematizationInsert;

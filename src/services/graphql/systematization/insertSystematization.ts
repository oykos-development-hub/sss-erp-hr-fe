const insertSystematization = `mutation($data: SystematizationInsertMutation!) {
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

export default insertSystematization;

const insertJobTender = `mutation($data: JobTenderInsertMutation!) {
      jobTenders_Insert(data: $data) {
          message
          status
          data
          item {
              id
              organization_unit {
                  id
                  title
              }
              type {
                  id
                  title
              }
              description
              number_of_vacant_seats
              serial_number
              active
              date_of_start
              date_of_end
              created_at
              updated_at
              file_id
          }
      }
  }`;

export default insertJobTender;

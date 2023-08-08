import {GraphQL} from '..';
import {JobTender, JobTendersResponse} from '../../../types/graphql/jobTenders';

const jobTenderInsert = async (dataJobTender: JobTender): Promise<JobTendersResponse['data']['jobTenders_Insert']> => {
  let data: any;
  const mutation = `mutation($data: JobTenderInsertMutation!) {
      jobTenders_Insert(data: $data) {
          message
          status
          item {
              id
              organization_unit {
                  id
                  title
              }
              job_position {
                  id
                  title
              }
              type {
                  id
                  title
              }
              description
              serial_number
              available_slots
              active
              date_of_start
              date_of_end
              created_at
              updated_at
              file_id
          }
      }
  }`;
  data = {
    position_in_organization_unit_id: dataJobTender.job_position?.id,
    type: dataJobTender?.type_tender?.id,
    description: '',
    serial_number: dataJobTender.serial_number,
    available_slots: dataJobTender.available_slots,
    active: dataJobTender.active,
    date_of_start: dataJobTender.date_of_start,
    date_of_end: dataJobTender.date_of_end,
    file_id: dataJobTender.file_id,
  };
  if (dataJobTender.id > 0) data.id = dataJobTender.id;
  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.jobTenders_Insert || {};
};

export default jobTenderInsert;

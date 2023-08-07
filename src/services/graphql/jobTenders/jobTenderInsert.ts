import {GraphQL} from '..';
import {JobTender, JobTendersResponse} from '../../../types/graphql/jobTenders';

const jobTenderInsert = async (data: JobTender): Promise<JobTendersResponse['data']['jobTenders_Insert']> => {
  const response = await GraphQL.fetch(`
  mutation {
    jobTenders_Insert(data: {
      id: ${data.id},
      position_in_organization_unit_id: ${data.organization_unit.id},
      type: "${data?.type}",
      description: "${data.description}",
      serial_number: "${data.serial_number}",
      available_slots: ${data.available_slots},
      active: ${data.active},
      date_of_start: "${data.date_of_start}",
      date_of_end: "${data.date_of_end}",
      file_id: ${data.file_id}
    }) {
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
        type
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
  }`);
  return response?.data?.jobTenders_Insert || {};
};

export default jobTenderInsert;

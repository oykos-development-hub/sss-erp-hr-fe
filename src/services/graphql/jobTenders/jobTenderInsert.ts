import {GraphQL} from '..';
import {JobTender, JobTendersResponse} from '../../../types/graphql/jobTenders';

const jobTenderInsert = async (data: JobTender): Promise<JobTendersResponse['data']['jobTenders_Insert']> => {
  const mutation = `mutation($data: JobTenderInsertMutation!) {
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

  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.jobTenders_Insert || {};
};

export default jobTenderInsert;

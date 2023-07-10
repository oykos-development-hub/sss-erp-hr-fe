import {JobTendersResponse} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

const jobTenderDetails = async ({id}: {id: number}): Promise<JobTendersResponse['data']['jobTender_Details']> => {
  const response = await GraphQL.fetch(`query {
    jobTender_Details(id: ${id}) {
        message
        status
        items {
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

  return response?.data?.jobTender_Details || {};
};

export default jobTenderDetails;

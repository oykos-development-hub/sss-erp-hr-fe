import {JobTenderApplicationInsertParams, JobTenderApplicationResponse} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

const jobTenderApplicationInsert = async (
  data: JobTenderApplicationInsertParams,
): Promise<JobTenderApplicationResponse['data']['jobTender_Applications_Insert']> => {
  const mutation = `mutation($data: JobTenderApplicationInsertMutation!) {
    jobTender_Applications_Insert(data: $data) {
        message
        status
        data
        item {
            id
            active
            job_tender {
                title
                id
            }
            user_profile {
                title
                id
            }
            date_of_application
            type
            status
            first_name
            last_name
            nationality
            date_of_birth
            date_of_application
            official_personal_id
            evaluation
            status
            created_at
            updated_at
            file_id
        }
    }
}`;
  const response = await GraphQL.fetch(mutation, {data});

  return response.data?.jobTender_Applications_Insert || {};
};

export default jobTenderApplicationInsert;

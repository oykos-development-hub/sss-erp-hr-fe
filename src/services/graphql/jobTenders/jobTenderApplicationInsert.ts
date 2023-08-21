import {JobTenderApplicationInsertParams, JobTenderApplicationResponse} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

const jobTenderApplicationInsert = async (
  data: JobTenderApplicationInsertParams,
): Promise<JobTenderApplicationResponse['data']['jobTender_Applications_Insert']> => {
  const mutation = `mutation($data: JobTenderApplicationInsertMutation!) {
        jobTender_Applications_Insert(data: $data) {
            message
            status
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
                created_at
                updated_at
                file_id
            }
        }
    }`;
  const response = await GraphQL.fetch(mutation, data);

  return response.data?.jobTender_Applications_Insert || {};
};

export default jobTenderApplicationInsert;

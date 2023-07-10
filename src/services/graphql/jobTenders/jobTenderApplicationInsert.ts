import {JobTenderApplicationInsertParams, JobTenderApplicationResponse} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

const jobTenderApplicationInsert = async (
  data: JobTenderApplicationInsertParams,
): Promise<JobTenderApplicationResponse['data']['jobTender_Applications_Insert']> => {
  const response = await GraphQL.fetch(`
        mutation {
            jobTender_Applications_Insert(data: {
                id: ${data.id},
                status: "${data.status}",
                job_tender_id: ${data.job_tender_id},
                user_profile_id: ${data.user_profile_id},
                type: "${data.type}",
                first_name: "${data.first_name}",
                last_name: "${data.last_name}",
                official_personal_id: "${data.official_personal_id}",
                date_of_birth: "${data.date_of_birth}",
                nationality: "${data.nationality}",
                evaluation: "${data.evaluation}",
                date_of_application: "${data.date_of_application}",
                file_id: ${data.file_id}
            }) {
                message
                status
                item {
                    id
                    status
                    job_tender {
                        title
                        id
                    }
                    user_profile {
                        title
                        id
                    }
                    type
                    first_name
                    last_name
                    official_personal_id
                    date_of_birth
                    nationality
                    evaluation
                    date_of_application
                    created_at
                    updated_at
                    file_id
                }
            }
        }
    `);

  return response.data?.jobTender_Applications_Insert || {};
};

export default jobTenderApplicationInsert;

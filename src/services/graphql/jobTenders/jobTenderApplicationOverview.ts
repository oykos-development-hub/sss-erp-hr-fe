import {JobTenderApplicationResponse, JobTenderApplicationsParams} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

const jobTenderApplicationOverview = async ({
  page,
  size,
  id,
  job_tender_id,
}: JobTenderApplicationsParams): Promise<{data: JobTenderApplicationResponse['data']['jobTender_Applications']}> => {
  const query = `query JobTendersApplications($id: Int, $job_tender_id: Int, $page: Int, $size: Int) {
    jobTender_Applications(id: $id, job_tender_id: $job_tender_id, page: $page, size: $size) {
        message
        status
        total
        items {
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
            type
            first_name
            last_name
            official_personal_id
            date_of_birth
            nationality
            status
            evaluation
            date_of_application
            created_at
            updated_at
            file_id
        }
    }
}`;
  const response = await GraphQL.fetch(query, {page, size, id, job_tender_id});

  return response.data.jobTender_Applications || {};
};

export default jobTenderApplicationOverview;

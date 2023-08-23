import {JobTendersResponse} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

interface UseJobTendersParams {
  page?: number;
  size?: number;
  id?: number;
  active?: boolean;
  organization_unit_id?: number;
  type_id?: number;
}

const jobTenderOverview = async ({
  page,
  size,
  id = 0,
  active = true,
  organization_unit_id = 0,
  type_id = 0,
}: UseJobTendersParams): Promise<{data: JobTendersResponse['data']['jobTenders_Overview']}> => {
  const query = `query JobTendersOverview($id: Int, $page: Int!, $size: Int!, $organization_unit_id: Int, $active: Boolean, $type_id: Int) {
    jobTenders_Overview(
        id: $id,
        page: $page, 
        size: $size, 
        organization_unit_id: $organization_unit_id,
        active: $active,
        type_id: $type_id
        ) {
        message
        status
        total
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

  const response = await GraphQL.fetch(query, {id, page, size, organization_unit_id, active, type_id});

  return response?.data?.jobTenders_Overview || {};
};

export default jobTenderOverview;

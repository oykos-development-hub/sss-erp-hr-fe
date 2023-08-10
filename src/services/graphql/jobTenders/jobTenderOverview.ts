import {JobTendersResponse} from '../../../types/graphql/jobTenders';
import {GraphQL} from '../index';

interface UseJobTendersParams {
  page: number;
  size: number;
  id: number;
  active: boolean;
  organization_unit_id: number;
  type: string;
}

const jobTenderOverview = async ({
  page,
  size,
  id = 0,
  active = true,
  organization_unit_id = 0,
  type = '',
}: UseJobTendersParams): Promise<{data: JobTendersResponse['data']['jobTenders_Overview']}> => {
  const query = `query JobTendersOverview($id: Int, $page: Int!, $size: Int!, $organization_unit_id: Int, $active: Boolean) {
      jobTenders_Overview(
          id: $id,
          page: $page, 
          size: $size, 
          organization_unit_id: $organization_unit_id,
          active: $active
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

  const response = await GraphQL.fetch(query, {id, page, size, organization_unit_id, active});

  return response?.data?.jobTenders_Overview || {};
};

export default jobTenderOverview;

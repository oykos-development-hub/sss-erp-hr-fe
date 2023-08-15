import {GraphQL} from '..';
import {InternalRevisionResponse} from '../../../types/graphql/internalRevision';

const revisionOverview = async (
  page?: number,
  size?: number,
  id?: number,
  organization_unit_id?: number,
  revisor_user_profile_id?: number,
): Promise<InternalRevisionResponse['data']['revisions_Overview']> => {
  const queryIdentifier = 'revisions_Overview';

  const query = `query RevisionsOverview($id: Int, $organization_unit_id: Int, $revisor_user_profile_id: Int, $page: Int, $size: Int) {
    revisions_Overview(id: $id, organization_unit_id: $organization_unit_id, revisor_user_profile_id: $revisor_user_profile_id, page: $page, size: $size) {
        message
        status
        total
        revisors {
            title
            id
        }
        items {
            id
            revision_type {
                id
                title
            }
            revisor_user_profile {
                id
                title
            }
            revision_organization_unit {
                id
                title
            }
            title
            planned_year
            planned_quarter
        }
    }
}`;
  const response = await GraphQL.fetch(query, {id, organization_unit_id, revisor_user_profile_id, page, size});

  return response?.data[queryIdentifier] || {};
};

export default revisionOverview;

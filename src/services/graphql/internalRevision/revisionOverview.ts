import {GraphQL} from '..';
import {InternalRevisionResponse} from '../../../types/graphql/internalRevision';

const revisionOverview = async (
  page = 1,
  size = 10,
  id = 0,
  organization_unit_id = 0,
  revisor_user_profile_id = 0,
): Promise<InternalRevisionResponse['data']['revisions_Overview']> => {
  const queryIdentifier = 'revisions_Overview';
  const response = await GraphQL.fetch(`query  {
    revisions_Overview(id: ${id}, organization_unit_id: ${organization_unit_id}, revisor_user_profile_id: ${revisor_user_profile_id}, page: ${page}, size: ${size}) {
        message
        status
        total
        revisors {
          id
          title
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
            created_at
            updated_at
        }
    }
}`);

  return response?.data[queryIdentifier] || {};
};

export default revisionOverview;

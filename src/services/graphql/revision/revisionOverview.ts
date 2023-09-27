import {GraphQL} from '..';
import {RevisionResponse} from '../../../types/graphql/revisionOverview';

const revisionOverview = async (
  plan_id: number,
  internal_revision_subject_id: number,
  revision_type_id: number,
  revisor_id: number,
): Promise<RevisionResponse['data']['revision_Overview']> => {
  const query = `query RevisionOverview($page: Int, $size: Int, $internal_revision_subject_id: Int, $revision_type_id: Int, $revisor_id: Int, $plan_id: Int){
    revision_Overview(page: $page, size: $size, internal_revision_subject_id: $internal_revision_subject_id, revision_type_id: $revision_type_id, revisor_id: $revisor_id, plan_id: $plan_id) {
        message
        status
        data
        total
        revisors {
            title
            id
        }
        items {
            id
            title
            plan_id
            serial_number
            date_of_revision
            revision_priority
            revision_quartal
            internal_revision_subject {
                id
                title
            }
            external_revision_subject {
                id
                title
            }
            revisor {
                id
                title
            }
            revision_type {
                id
                title
            }
            file_id
            created_at
            updated_at
        }
    }
}`;
  const response = await GraphQL.fetch(query, {plan_id, internal_revision_subject_id, revision_type_id, revisor_id});
  return response?.data?.revision_Overview || {};
};

export default revisionOverview;

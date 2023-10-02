import {GraphQL} from '..';
import {RevisionTipsResponse} from '../../../types/graphql/revisionTipsOverview';

const revisionTipsOverview = async (
  revision_id: number,
): Promise<RevisionTipsResponse['data']['revision_tips_Overview']> => {
  const query = `query RevisionTipsOverview($page: Int, $size: Int, $revision_id: Int){
    revision_tips_Overview(page: $page, size: $size, revision_id: $revision_id) {
        message
        status
        total
        revisors {
            title
            id
        }
        items {
            id
            revision_id
            date_of_accept
            due_date
            date_of_reject
            date_of_execution
            recommendation
            status
            documents
            reasons_for_non_executing
            user_profile {
                id
                title
            }
            file_id
            created_at
            updated_at
            responsible_person
            new_due_date 
            new_date_of_execution
        }
    }
}`;
  const response = await GraphQL.fetch(query, {revision_id});
  return response?.data?.revision_tips_Overview || {};
};

export default revisionTipsOverview;

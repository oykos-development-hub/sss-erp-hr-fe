import {GraphQL} from '..';
import {RevisionTipsResponse} from '../../../types/graphql/revisionTipsOverview';

const revisionTipsDetails = async (id: number): Promise<RevisionTipsResponse['data']['revision_tips_Details']> => {
  const query = `query RevisionTipsDetails($id: Int!){
    revision_tips_Details(id: $id) {
        message
        status
        item {
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
  const response = await GraphQL.fetch(query, {id});
  return response?.data?.revision_tips_Details || {};
};

export default revisionTipsDetails;

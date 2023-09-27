import {GraphQL} from '..';
import {revisionTipsInsertItem, revisionTipsInsertResponse} from '../../../types/graphql/revisionTipsInsert';

const revisionTipsInsert = async (
  data: revisionTipsInsertItem,
): Promise<revisionTipsInsertResponse['data']['revision_tips_Insert']> => {
  const mutation = `mutation($data: RevisionTipsInsertMutation!) {
    revision_tips_Insert(data: $data) {
        message
        status
        data
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
        }
    }
}`;
  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.revision_tips_Insert || {};
};

export default revisionTipsInsert;

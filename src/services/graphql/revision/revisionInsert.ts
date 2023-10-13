import {GraphQL} from '..';
import {revisionInsertItem, revisionInsertResponse} from '../../../types/graphql/revisionInsert';

const revisionInsert = async (data: revisionInsertItem): Promise<revisionInsertResponse['data']['revision_Insert']> => {
  const mutation = `mutation($data: RevisionsInsertMutation!) {
        revision_Insert(data: $data) {
            message
            status
            data
            item {
                id
                title
                plan_id
                serial_number
                date_of_revision
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
  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.revision_Insert || {};
};

export default revisionInsert;

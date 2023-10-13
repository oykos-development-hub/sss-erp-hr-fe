import {GraphQL} from '..';
import {RevisionResponse} from '../../../types/graphql/revisionOverview';

const revisionDetails = async (id: number): Promise<RevisionResponse['data']['revision_Details']> => {
  const query = `query RevisionDetails($id: Int!){
        revision_Details(id: $id) {
            message
            status
            revisors {
                title
                id
            }
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
  const response = await GraphQL.fetch(query, {id});
  return response?.data?.revision_Details || {};
};

export default revisionDetails;

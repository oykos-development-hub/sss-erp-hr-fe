import {GraphQL} from '..';

const revisionDelete = async (id: number): Promise<any['data']['revision_Delete']> => {
  const mutation = ` mutation($id: Int!) {
        revision_Delete(id: $id) {
            message
            status
        }
    } `;

  const response = await GraphQL.fetch(mutation, {id});
  return response?.data?.revision_Delete || {};
};

export default revisionDelete;

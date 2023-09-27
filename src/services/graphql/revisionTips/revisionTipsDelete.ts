import {GraphQL} from '..';

const revisionTipsDelete = async (id: number): Promise<any['data']['revision_tips_Delete']> => {
  const mutation = `mutation($id: Int!) {
    revision_tips_Delete(id: $id) {
        message
        status
    }
}`;
  const response = await GraphQL.fetch(mutation, {id});
  return response?.data?.revision_tips_Delete || {};
};

export default revisionTipsDelete;

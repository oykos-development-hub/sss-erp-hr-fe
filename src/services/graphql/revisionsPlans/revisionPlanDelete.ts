import {GraphQL} from '..';

const revisionPlanDelete = async (id: number): Promise<any['data']['revision_plans_Delete']> => {
  const mutation = `
  mutation($id: Int!) {
    revision_plans_Delete(id: $id) {
        message
        status
    }
}
      `;
  const response = await GraphQL.fetch(mutation, {id});
  return response?.data?.revision_plans_Delete || {};
};

export default revisionPlanDelete;

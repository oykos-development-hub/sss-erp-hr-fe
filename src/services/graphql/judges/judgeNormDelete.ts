import {GraphQL} from '..';
import {JudgeNormsDeleteResponse} from '../../../types/graphql/judges';

const judgeNormDelete = async (id: number): Promise<JudgeNormsDeleteResponse['data']['judgeNorms_Delete']> => {
  const mutation = `
    mutation($id: Int!) {
      judgeNorms_Delete(id: $id) {
        message
        status
      }
    }
    `;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.judgeNorms_Delete || {};
};

export default judgeNormDelete;

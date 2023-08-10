import {GraphQL} from '..';
import {JudgeNormsDeleteResponse} from '../../../types/graphql/judges';

const judgeNormDelete = async (id: number): Promise<JudgeNormsDeleteResponse['data']['judgeNorms_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
        judgeNorms_Delete(id: ${id}) {
            message
            status
        }
    }
    `);

  return response?.data?.judgeNorms_Delete || {};
};

export default judgeNormDelete;

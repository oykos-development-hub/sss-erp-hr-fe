import {GraphQL} from '..';
import {JudgeResolutionsDeleteResponse} from '../../../types/graphql/judges';

const judgeResolutionDelete = async (
  id: number,
): Promise<JudgeResolutionsDeleteResponse['data']['judgeResolutions_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
        judgeResolutions_Delete(id: ${id}) {
            message
            status
        }
    }
    `);

  return response?.data?.judgeResolutions_Delete || {};
};

export default judgeResolutionDelete;

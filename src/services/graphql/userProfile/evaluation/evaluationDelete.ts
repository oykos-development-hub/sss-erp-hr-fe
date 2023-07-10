import {GraphQL} from '../..';
import {UserProfileDeleteEvaluationResponse} from '../../../../types/graphql/userProfileDeleteEvaluation';

const evaluationDelete = async (
  id: number,
): Promise<UserProfileDeleteEvaluationResponse['data']['userProfile_Evaluation_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Evaluation_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response.data.userProfile_Evaluation_Delete || {};
};

export default evaluationDelete;

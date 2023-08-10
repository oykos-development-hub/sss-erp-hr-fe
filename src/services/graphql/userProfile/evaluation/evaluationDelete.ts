import {GraphQL} from '../..';
import {UserProfileDeleteEvaluationResponse} from '../../../../types/graphql/userProfileDeleteEvaluation';

const evaluationDelete = async (
  id: number,
): Promise<UserProfileDeleteEvaluationResponse['data']['userProfile_Evaluation_Delete']> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Evaluation_Delete(id: $id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response.data.userProfile_Evaluation_Delete || {};
};

export default evaluationDelete;

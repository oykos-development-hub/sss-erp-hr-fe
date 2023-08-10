import {GraphQL} from '../..';
import {
  UserProfileEvaluation,
  UserProfileEvaluationFormValues,
} from '../../../../types/graphql/userProfileGetEvaluations';
import {UserProfileInsertEvaluationResponse} from '../../../../types/graphql/userProfileInsertEvaluation';

const evaluationInsert = async (
  data: UserProfileEvaluationFormValues,
): Promise<UserProfileInsertEvaluationResponse['data']['userProfile_Evaluation_Insert']> => {
  const mutation = `mutation UserProfileEvaluationInsert($data: UserProfileEvaluationInsertMutation!){
    userProfile_Evaluation_Insert(data: $data) {
        message
        status
        item {
            id
            user_profile_id
            evaluation_type {
                id
                title
            }
            date_of_evaluation
            score
            evaluator
            is_relevant
            created_at
            updated_at
            file_id
        }
    }
}`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.userProfile_Evaluation_Insert || {};
};

export default evaluationInsert;

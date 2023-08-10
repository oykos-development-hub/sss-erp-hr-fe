import {GraphQL} from '../..';
import {UserProfileEvaluation} from '../../../../types/graphql/userProfileGetEvaluations';
import {UserProfileInsertEvaluationResponse} from '../../../../types/graphql/userProfileInsertEvaluation';

const evaluationInsert = async (
  data: UserProfileEvaluation,
): Promise<UserProfileInsertEvaluationResponse['data']['userProfile_Evaluation_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Evaluation_Insert(data: {        
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      evaluation_type_id: 2,
      date_of_evaluation: "${data.date_of_evaluation}",
      score: "${data.score}",
      evaluator: "${data.evaluator}",
      is_relevant: ${data.is_relevant},
      file_id: ${data.file_id},
    }
    ) {
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
}`);

  return response?.data?.userProfile_Evaluation_Insert || {};
};

export default evaluationInsert;

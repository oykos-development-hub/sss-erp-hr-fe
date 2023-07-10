import {GraphQL} from '../..';
import {UserProfileEvaluationResponse} from '../../../../types/graphql/userProfileGetEvaluations';

const evaluationOverview = async (
  id: number,
): Promise<UserProfileEvaluationResponse['data']['userProfile_Evaluation']> => {
  const response = await GraphQL.fetch(`query {
    userProfile_Evaluation(user_profile_id: ${id}) {
        message
        status
        items {
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

  return response?.data?.userProfile_Evaluation || {};
};

export default evaluationOverview;

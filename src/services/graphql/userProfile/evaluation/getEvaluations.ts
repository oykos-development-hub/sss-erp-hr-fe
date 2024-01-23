const getEvaluations = `query UserProfileEvaluation($user_profile_id: Int!){
    userProfile_Evaluation(user_profile_id: $user_profile_id) {
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
            decision_number
            evaluation_period
            reason_for_evaluation
            created_at
            updated_at
            file_id
            file {
                id
                name
                type
            }
        }
    }
}`;

export default getEvaluations;

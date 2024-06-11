const insertEvaluation = `mutation UserProfileEvaluationInsert($data: UserProfileEvaluationInsertMutation!){
    userProfileEvaluation_Insert(data: $data) {
        message
        status
        data
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
            reason_for_evaluation
            is_relevant
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

export default insertEvaluation;

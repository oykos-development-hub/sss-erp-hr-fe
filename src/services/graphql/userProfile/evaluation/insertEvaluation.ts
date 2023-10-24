const insertEvaluation = `mutation UserProfileinsertEvaluation($data: UserProfileEvaluationInsertMutation!){
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

export default insertEvaluation;

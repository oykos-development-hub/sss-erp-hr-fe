const judgeEvaluationReport = `query JudgeRevaluationReport($organization_unit_id: Int, $reason_for_evaluation: String, $score: String){
    judgeEvaluation_Report(organization_unit_id: $organization_unit_id, reason_for_evaluation: $reason_for_evaluation, score: $score) {
        message
        data
        status
        items {
            id
            full_name
            judgment
            reason_for_evaluation
            date_of_evaluation
            score
            evaluation_period
            decision_number
        }
    }
}`;
export default judgeEvaluationReport;

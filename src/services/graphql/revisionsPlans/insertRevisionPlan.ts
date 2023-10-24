const insertRevisionPlan = `mutation($data: RevisionPlanInsertMutation!) {
        revision_plans_Insert(data: $data) {
            message
            status
            data
            item {
                id
                name
                year
                created_at
                updated_at
            }
        }
    }`;

export default insertRevisionPlan;

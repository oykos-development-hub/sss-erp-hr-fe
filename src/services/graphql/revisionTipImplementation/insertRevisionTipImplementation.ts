const insertRevisionTipImplementation = `mutation($data: RevisionTipImplementationInsertMutation!) {
    revisionTipImplementation_Insert(data: $data) {
        message
        status
        data
        item {
            id
            tip_id
            status
            new_due_date
            new_date_of_execution
            reasons_for_non_executing
            revisor {
                id
                title
            }
            documents
            files {
                id
                name
                type
            }
            created_at
            updated_at
        }
    }
}`;

export default insertRevisionTipImplementation;

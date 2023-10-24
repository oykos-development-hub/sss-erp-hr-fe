const insertRevisionTip = `mutation($data: RevisionTipsInsertMutation!) {
    revision_tips_Insert(data: $data) {
        message
        status
        data
        item {
            id
            revision_id
            date_of_accept
            due_date
            date_of_reject
            date_of_execution
            recommendation
            status
            documents
            reasons_for_non_executing
            revision_priority
            end_date
            user_profile {
                id
                title
            }
            file_id
            created_at
            updated_at
            responsible_person
            new_due_date 
            new_date_of_execution
        }
    }
}`;

export default insertRevisionTip;

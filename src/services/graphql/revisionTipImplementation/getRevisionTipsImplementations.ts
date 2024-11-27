const getRevisionTipsImplementations = `query RevisionTipImplementationsOverview($tip_id: Int, $id: Int){
    revisionTipImplementations_Overview(tip_id: $tip_id, id: $id) {
        message
        status
        revisors {
            title
            id
        }
        items {
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

export default getRevisionTipsImplementations;

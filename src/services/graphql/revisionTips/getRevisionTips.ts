const getRevisionTips = `query RevisionTipsOverview($page: Int, $size: Int, $revision_id: Int){
    revisionTips_Overview(page: $page, size: $size, revision_id: $revision_id) {
        message
        status
        total
        revisors {
            title
            id
        }
        items {
            id
            revision_id
            date_of_accept
            due_date
            date_of_reject
            date_of_execution
            recommendation
            status
            revision_priority
            end_date
            user_profile {
                id
                title
            }
            files {
              id
              name
              type
            }
            created_at
            updated_at
            responsible_person
        }
    }
}`;

export default getRevisionTips;

const getRevisions = `query RevisionOverview($page: Int, $size: Int, $internal_revision_subject_id: Int, $revision_type_id: Int, $revisor_id: Int, $plan_id: Int){
    revision_Overview(page: $page, size: $size, internal_revision_subject_id: $internal_revision_subject_id, revision_type_id: $revision_type_id, revisor_id: $revisor_id, plan_id: $plan_id) {
        message
        status
        data
        total
        revisors {
            title
            id
        }
        items {
            id
            title
            plan_id
            serial_number
            date_of_revision
            revision_quartal
            internal_revision_subject {
                id
                title
            }
            external_revision_subject {
                id
                title
            }
            revisor {
                id
                title
            }
            revision_type {
                id
                title
            }
            file {
              id
              name
              type
            }
            created_at
            updated_at
        }
    }
}`;

export default getRevisions;

const insertRevision = `mutation($data: RevisionsInsertMutation!) {
        revision_Insert(data: $data) {
            message
            status
            data
            item {
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
                tips_file {
                    id
                    name
                    type
                }
                created_at
                updated_at
            }
        }
    }`;

export default insertRevision;

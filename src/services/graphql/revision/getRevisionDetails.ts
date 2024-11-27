const getRevisionDetails = `query RevisionDetails($id: Int!){
        revision_Details(id: $id) {
            message
            status
            revisors {
                title
                id
            }
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
                files {
                  id
                  name
                  type
                }
                tips_files {
                    id
                    name
                    type
                }
            }
        }
    }`;

export default getRevisionDetails;

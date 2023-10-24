const deleteRevision = `mutation($id: Int!) {
        revision_Delete(id: $id) {
            message
            status
        }
    } `;

export default deleteRevision;

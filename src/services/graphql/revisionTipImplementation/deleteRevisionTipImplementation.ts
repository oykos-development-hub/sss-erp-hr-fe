const deleteRevisionTipImplementation = `mutation($id: Int!) {
    revisionTipImplementation_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteRevisionTipImplementation;

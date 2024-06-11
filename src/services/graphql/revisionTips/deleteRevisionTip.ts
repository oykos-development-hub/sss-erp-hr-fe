const deleteRevisionTip = `mutation($id: Int!) {
    revisionTips_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteRevisionTip;

const deleteRevisionTip = `mutation($id: Int!) {
    revision_tips_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteRevisionTip;

const deleteSystematization = `mutation($id: Int!) {
    systematizations_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteSystematization;

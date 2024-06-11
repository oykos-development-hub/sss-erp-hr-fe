const deleteResolution = `mutation($id: Int!) {
    userProfileResolution_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteResolution;

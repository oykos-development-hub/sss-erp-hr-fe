const deleteResolution = `mutation($id: Int!) {
    userProfile_Resolution_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteResolution;

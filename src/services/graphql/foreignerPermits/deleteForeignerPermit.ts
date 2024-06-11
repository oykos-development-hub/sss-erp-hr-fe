const deleteForeignerPermit = `mutation($id: Int!) {
    userProfileForeigner_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteForeignerPermit;

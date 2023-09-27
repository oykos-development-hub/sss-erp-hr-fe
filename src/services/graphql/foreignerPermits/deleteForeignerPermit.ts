const deleteForeignerPermit = `mutation($id: Int!) {
    userProfile_Foreigner_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteForeignerPermit;

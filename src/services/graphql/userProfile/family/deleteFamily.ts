const deleteFamily = `mutation($id: Int!) {
    userProfileFamily_Delete(id: $id) {
        message
        status
    }
  }`;

export default deleteFamily;

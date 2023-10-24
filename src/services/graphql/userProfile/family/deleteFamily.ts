const deleteFamily = `mutation($id: Int!) {
    userProfile_Family_Delete(id: $id) {
        message
        status
    }
  }`;

export default deleteFamily;

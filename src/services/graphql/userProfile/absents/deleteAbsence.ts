const deleteAbsence = `mutation($id: Int!) {
    userProfileAbsent_Delete(id: $id) {
      message
      status
    }
}`;

export default deleteAbsence;

const deleteAbsence = `mutation($id: Int!) {
    userProfile_Absent_Delete(id: $id) {
      message
      status
    }
}`;

export default deleteAbsence;

const deleteEducation = `
    mutation($id: Int!) {
      userProfile_Education_Delete(id: $id) {
          message
          status
      }
    }
  `;

export default deleteEducation;

const deleteEducation = `
    mutation($id: Int!) {
      userProfileEducation_Delete(id: $id) {
          message
          status
      }
    }
  `;

export default deleteEducation;

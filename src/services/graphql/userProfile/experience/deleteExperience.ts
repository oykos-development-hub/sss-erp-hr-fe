const deleteExperience = `mutation($id: Int!) {
    userProfile_Experience_Delete(id: $id) {
        message
        status
      }
  }`;

export default deleteExperience;

const deleteExperience = `mutation($id: Int!) {
    userProfileExperience_Delete(id: $id) {
        message
        status
      }
  }`;

export default deleteExperience;

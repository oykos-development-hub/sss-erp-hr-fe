const deleteJobTenderApplication = `
       mutation($id: Int!) {
          jobTender_Applications_Delete(id: $id) {
              message
              status
          }
      }
    `;

export default deleteJobTenderApplication;

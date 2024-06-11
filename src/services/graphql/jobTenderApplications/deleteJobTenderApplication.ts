const deleteJobTenderApplication = `
       mutation($id: Int!) {
          jobTenderApplications_Delete(id: $id) {
              message
              status
          }
      }
    `;

export default deleteJobTenderApplication;

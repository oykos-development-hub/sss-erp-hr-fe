const deleteJobTender = `
       mutation($id: Int!) {
          jobTenders_Delete(id: $id) {
              message
              status
          }
      }
    `;

export default deleteJobTender;

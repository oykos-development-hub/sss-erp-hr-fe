const deleteRevisionPlan = `
  mutation($id: Int!) {
      revisionPlans_Delete(id: $id) {
          message
          status
      }
  }
`;

export default deleteRevisionPlan;

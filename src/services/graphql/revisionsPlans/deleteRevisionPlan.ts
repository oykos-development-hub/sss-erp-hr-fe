const deleteRevisionPlan = `
  mutation($id: Int!) {
      revision_plans_Delete(id: $id) {
          message
          status
      }
  }
`;

export default deleteRevisionPlan;

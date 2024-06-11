const deleteEvaluation = `mutation($id: Int!) {
    userProfileEvaluation_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteEvaluation;

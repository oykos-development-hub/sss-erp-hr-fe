const deleteEvaluation = `mutation($id: Int!) {
    userProfile_Evaluation_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteEvaluation;

const deleteJudgeNorm = `
    mutation($id: Int!) {
      judgeNorms_Delete(id: $id) {
        message
        status
      }
    }
    `;

export default deleteJudgeNorm;

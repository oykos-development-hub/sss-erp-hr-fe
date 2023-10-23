const deleteJudgeResolution = `
    mutation($id: Int!) {
        judgeResolutions_Delete(id: $id) {
            message
            status
        }
    }
    `;

export default deleteJudgeResolution;

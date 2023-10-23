const getJudgeAvailability = `query CheckJudgeAndPresidentIsAvailable($organization_unit_id: Int) {
    checkJudgeAndPresidentIsAvailable(organization_unit_id: $organization_unit_id) {
        status 
        message
        item {
            judge
            president
        }
    }
}`;

export default getJudgeAvailability;

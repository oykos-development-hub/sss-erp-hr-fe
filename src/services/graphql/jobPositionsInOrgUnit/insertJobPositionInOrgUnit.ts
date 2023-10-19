const insertJobPositionInOrgUnit = `mutation($data: JobPositionInOrganizationUnitInsertMutation!) {
    jobPositionInOrganizationUnit_Insert(data: $data) {
        message
        status
        item {
            id
            systematization_id
            parent_organization_unit_id
            job_position_id
            available_slots
            requirements
            description
        }
    }
}`;

export default insertJobPositionInOrgUnit;

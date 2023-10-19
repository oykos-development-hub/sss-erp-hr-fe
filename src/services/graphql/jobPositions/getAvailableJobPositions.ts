const getAvailableJobPositions = `query JobPositionsAvailableInOrganizationUnit($organization_unit_id: Int, $office_unit_id: Int){
    jobPositionsAvailableInOrganizationUnit(organization_unit_id: $organization_unit_id, office_unit_id: $office_unit_id) {
        message
        status
        items {
            id
            title
        }
    }
}`;

export default getAvailableJobPositions;

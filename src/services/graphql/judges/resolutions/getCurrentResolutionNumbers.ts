const getCurrentResolutionNumbers = ` 
  query OrganizationUintCalculateEmployeeStats($resolution_id: Int, $active: Boolean) {
    organizationUintCalculateEmployeeStats(resolution_id: $resolution_id, active: $active) {
        status
        message
        items {
            id
            organization_unit {
                title
                id
            }
            available_slots_presidents
            available_slots_judges
            number_of_judges
            number_of_presidents
            number_of_employees
            number_of_relocated_judges
            number_of_suspended_judges
        }
    }
}`;

export default getCurrentResolutionNumbers;

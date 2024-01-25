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
            available_slots_total
            number_of_judges
            number_of_presidents
            total_number
            number_of_employees
            number_of_relocated_judges
            number_of_suspended_judges
            vacant_slots
            vacant_slots_judges
            vacant_slots_presidents
        }
    }
}`;

export default getCurrentResolutionNumbers;

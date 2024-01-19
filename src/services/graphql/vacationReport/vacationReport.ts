const vacationReport = `query VacationReport($employee_id: Int, $organization_unit_id: Int!, $type: Int!){
    vacation_Report(employee_id: $employee_id, organization_unit_id: $organization_unit_id, type: $type) {
        message
        status
        data
        items {
            full_name
            organization_unit
            total_days
            used_days
            left_days
        }
    }
}`;

export default vacationReport;

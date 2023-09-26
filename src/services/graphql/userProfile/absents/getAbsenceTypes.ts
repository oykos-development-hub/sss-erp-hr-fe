const getAbsenceTypes = `query AbsentType($page: Int, $size: Int) {
    absentType(page: $page, size: $size) {
        status 
        message
        total
        items {
            id
            title
            abbreviation
            accounting_days_off
            description
            color
            icon
        }
    }
}`;

export default getAbsenceTypes;

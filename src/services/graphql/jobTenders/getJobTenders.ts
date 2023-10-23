const getJobTenders = `query JobTendersOverview($id: Int, $page: Int!, $size: Int!, $organization_unit_id: Int, $active: Boolean, $type_id: Int) {
    jobTenders_Overview(
        id: $id,
        page: $page, 
        size: $size, 
        organization_unit_id: $organization_unit_id,
        active: $active,
        type_id: $type_id
        ) {
        message
        status
        total
        items {
            id
            organization_unit {
                id
                title
            }
            type {
                id
                title
            }
            number_of_vacant_seats
            description
            serial_number
            active
            date_of_start
            date_of_end
            created_at
            updated_at
            file_id
        }
    }
}`;

export default getJobTenders;

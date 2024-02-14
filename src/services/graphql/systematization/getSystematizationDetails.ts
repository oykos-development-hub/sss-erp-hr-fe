const getSystematizationDetails = `query SystematizationDetails($id: Int) {
    systematization_Details(id: $id) {
        status 
        message 
        item {
            id 
            user_profile { 
               id 
               title 
            } 
            organization_unit { 
                id 
                title
            }
            file {
                id
                name
                type
            }
            description
            serial_number 
            active 
            date_of_activation 
            created_at 
            updated_at 
            sectors {
                id
                parent_id
                title
                abbreviation
                color
                icon
                address
                description
                job_positions_organization_units {
                    id
                    job_positions {
                        title
                        id
                    }
                    description
                    serial_number
                    requirements
                    available_slots
                    employees {
                        title
                        id
                    }
                }
            }
            active_employees {
                id
                full_name
                job_position{
                    id
                    title
                }
                sector
            }
        } 
    } 
}`;

export default getSystematizationDetails;

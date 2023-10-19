const getJobPositions = `   
      query JobPositions($search: String) {
        jobPositions(search: $search) {
            message
            status
            items {
                id
                title
                abbreviation
                serial_number
                description
                requirements
                is_judge
                is_judge_president
                color
                icon
            }
        }
    }`;

export default getJobPositions;

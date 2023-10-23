const getJudgeResolutions = `query JudgeResolutionsOverview($page: Int, $size: Int) {
    judgeResolutions_Overview(page: $page, size: $size) {
        status 
        message
        total 
        items {
            id
            serial_number
            available_slots_judges
            number_of_judges
            active
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
    }
}`;

export default getJudgeResolutions;

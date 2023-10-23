const getJobTenderTypes = `query JobTendersTypes($search: String, $id: Int){
    jobTenderTypes(search: $search, id: $id) {
        message
        status
        items {
            id
            title
            abbreviation
            value
            description
            is_judge
            is_judge_president
            color
            icon
        }
    }
}`;

export default getJobTenderTypes;

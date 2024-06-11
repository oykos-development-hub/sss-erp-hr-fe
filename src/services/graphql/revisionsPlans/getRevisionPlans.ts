const getRevisionPlans = `query RevisionPlansOverview($page: Int, $size: Int, $year: String){
    revisionPlans_Overview(page: $page, size: $size, year: $year) {
        message
        status
        items {
            id
            name
            year
            created_at
            updated_at
        }
    }
}`;

export default getRevisionPlans;

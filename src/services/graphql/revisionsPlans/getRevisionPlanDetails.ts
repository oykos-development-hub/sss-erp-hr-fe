const getRevisionPlanDetails = `query RevisionPlansDetails($id: Int!){
    revision_plans_Details(id: $id) {
        message
        status
        item {
            id
            name
            year
            created_at
            updated_at
        }
    }
}`;

export default getRevisionPlanDetails;

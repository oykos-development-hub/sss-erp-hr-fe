const deleteJobPositionInOrgUnit = `mutation($id: Int!) {
    jobPositionInOrganizationUnit_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteJobPositionInOrgUnit;

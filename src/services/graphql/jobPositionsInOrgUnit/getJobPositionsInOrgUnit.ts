const getJobPositionsInOrgUnit = `query JobPositionsOrganizationUnit($organization_unit_id: Int){
      jobPositionsOrganizationUnit(organization_unit_id: $organization_unit_id) {
        message
        status
        items {
            id
            title
        }
      }
    }`;

export default getJobPositionsInOrgUnit;

import {GraphQL} from '..';
import {
  JobPositionInOrganizationUnitInsert,
  JobPositionInOrganizationUnitInsertResponse,
} from '../../../types/graphql/jobPositionInOrganizationUnitInsertTypes';

const jobPositionInOrganizationUnitInsert = async (
  data: JobPositionInOrganizationUnitInsert,
): Promise<JobPositionInOrganizationUnitInsertResponse['data']['jobPositionInOrganizationUnit_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    jobPositionInOrganizationUnit_Insert(data: {
      id: ${data.id},
      systematization_id: ${data.systematization_id},
      parent_organization_unit_id: ${data.parent_organization_unit_id},
      job_position_id: ${data.job_position_id},
      parent_job_position_id: ${data.parent_job_position_id},
      system_permission_id: ${data.system_permission_id},
      available_slots: ${data.available_slots},
      description: "${data.description}",
      serial_number: "${data.serial_number}",
      requirements: "${data.requirements}",
      icon: "${data.icon}",
    }
    ) {
      message
      status
      item {
            id
            systematization_id
            parent_organization_unit_id
            job_position_id
            parent_job_position_id
            system_permission_id
            available_slots
            description
            serial_number
            requirements
            icon
        }
  }
}`);

  return response?.data?.jobPositionInOrganizationUnit_Insert || {};
};

export default jobPositionInOrganizationUnitInsert;

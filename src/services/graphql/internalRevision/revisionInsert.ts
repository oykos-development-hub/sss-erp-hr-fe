import {GraphQL} from '..';
import {InternalRevisionDetails, InternalRevisionResponse} from '../../../types/graphql/internalRevision';

const revisionInsert = async (
  data: InternalRevisionDetails,
): Promise<InternalRevisionResponse['data']['revisions_Insert']> => {
  const queryIdentifier = 'revisions_Insert';
  const response = await GraphQL.fetch(`mutation {
    revisions_Insert(data: {
    revision_type_id: ${data.revision_type_id},
    revisor_user_profile_id: ${data.revisor_user_profile_id},
    revision_organization_unit_id: ${data.revision_organization_unit_id},
    responsible_user_profile_id: ${data.responsible_user_profile_id},
    implementation_user_profile_id: ${data.implementation_user_profile_id},
    title: "${data.title}",
    planned_year: "${data.planned_year}",
    planned_quarter: "${data.planned_quarter}",
    serial_number: "${data.serial_number}",
    priority: "${data.priority}",
    date_of_revision: "${data.date_of_revision}",
    date_of_acceptance: "${data.date_of_acceptance}",
    date_of_rejection: "${data.date_of_rejection}",
    implementation_suggestion: "${data.implementation_suggestion}",
    implementation_month_span: "${data.implementation_month_span}",
    date_of_implementation: "${data.date_of_implementation}",
    state_of_implementation: "${data.state_of_implementation}",
    implementation_failed_description: "${data.implementation_failed_description}",
    second_implementation_month_span: "${data.second_implementation_month_span}",
    second_date_of_revision: "${data.second_date_of_revision}",
    file_id: ${data.file_id},
    id: ${data.id}
    }) {
        message
        status
        items {
            id
            revision_type {
                id
                title
            }
            revisor_user_profile {
                id
                title
            }
            revision_organization_unit {
                id
                title
            }
            responsible_user_profile {
                id
                title
            }
            implementation_user_profile {
                id
                title
            }
            title
            planned_year
            planned_quarter
            serial_number
            priority
            date_of_revision
            date_of_acceptance
            date_of_rejection
            implementation_suggestion
            implementation_month_span
            date_of_implementation
            state_of_implementation
            implementation_failed_description
            second_implementation_month_span
            second_date_of_revision
            created_at
            updated_at
            file_id
        }
    }
}
`);

  return response?.data?.[queryIdentifier] || {};
};

export default revisionInsert;

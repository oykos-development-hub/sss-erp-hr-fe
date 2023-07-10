import {GraphQL} from '..';
import {InternalRevisionResponse} from '../../../types/graphql/internalRevision';

const revisionDetails = async (id: number): Promise<InternalRevisionResponse['data']['revision_Details']> => {
  const queryIdentifier = 'revision_Details';
  const response = await GraphQL.fetch(`query {
    revision_Details(id: ${id}) {
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
}`);

  return response?.data[queryIdentifier] || {};
};

export default revisionDetails;

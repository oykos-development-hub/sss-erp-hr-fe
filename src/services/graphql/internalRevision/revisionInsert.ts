import {GraphQL} from '..';
import {InternalRevisionFormValues, InternalRevisionInsertParams} from '../../../screens/internalRevision/types';
import {InternalRevisionDetails, InternalRevisionResponse} from '../../../types/graphql/internalRevision';

const revisionInsert = async (
  data: InternalRevisionInsertParams,
): Promise<InternalRevisionResponse['data']['revisions_Insert']> => {
  const queryIdentifier = 'revisions_Insert';

  const mutation = `mutation($data: RevisionInsertMutation!) {
    revisions_Insert(data: $data) {
        message
        status
        data
        item {
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
                value
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
            file_id
            ref_document
        }
    }
}`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.[queryIdentifier] || {};
};

export default revisionInsert;

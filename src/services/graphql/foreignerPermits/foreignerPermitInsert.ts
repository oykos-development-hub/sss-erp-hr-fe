import {GraphQL} from '..';
import {ForeignerPermitParams} from '../../../types/graphql/foreignerPermits';
import {UserProfileInsertExperienceResponse} from '../../../types/graphql/userProfileInsertExperienceTypes';

const foreignerPermitInsert = async (
  data: ForeignerPermitParams,
): Promise<UserProfileInsertExperienceResponse['data']['userProfile_Foreigner_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Foreigner_Insert(data: {
        id: ${data.id},
        user_profile_id: ${data.user_profile_id},
        work_permit_number: "${data.work_permit_number}",
        work_permit_issuer: "${data.work_permit_issuer}",
        work_permit_date_of_start: "${data.work_permit_date_of_start}",
        work_permit_date_of_end: "${data.work_permit_date_of_end}",
        work_permit_indefinite_length: ${data.residence_permit_indefinite_length},
        residence_permit_date_of_end: "${data.residence_permit_date_of_end}",
        residence_permit_indefinite_length: ${data.residence_permit_indefinite_length},
        residence_permit_number: "${data.residence_permit_number}",
        country_of_origin: "${data.country_of_origin}",
    }) {
        message
        status
        item {
            id
            user_profile_id
            work_permit_number
            work_permit_issuer
            work_permit_date_of_start
            work_permit_date_of_end
            work_permit_indefinite_length
            residence_permit_date_of_start
            residence_permit_date_of_end
            residence_permit_indefinite_length
            residence_permit_number
            residence_permit_issuer
            country_of_origin
            created_at
            updated_at
            work_permit_file_id
            residence_permit_file_id
            created_at
            updated_at
        }
    }
}`);

  return response?.data.userProfile_Foreigner_Insert || {};
};

export default foreignerPermitInsert;

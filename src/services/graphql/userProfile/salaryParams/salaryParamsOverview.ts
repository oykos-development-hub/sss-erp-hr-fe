import {GraphQL} from '../..';
import {UserProfileGetSalaryParamsResponse} from '../../../../types/graphql/userProfileGetSalaryParams';

const salaryParamsOverview = async (id: number): Promise<UserProfileGetSalaryParamsResponse> => {
  const query = `query UserProfileSalaryParams($user_profile_id: Int!){
    userProfile_SalaryParams(user_profile_id: $user_profile_id) {
        message
        status
        items {
            id
            user_profile {
                id
                title
            }
            benefited_track
            organization_unit {
                id
                title
            }
            without_raise
            insurance_basis
            salary_rank
            daily_work_hours
            weekly_work_hours
            education_rank
            education_naming
            resolution {
                id
                user_profile {
                    id
                    title
                },
                resolution_type {
                    id
                    title
                }
                resolution_purpose,
                date_of_start,
                date_of_end,
                file_id
            }
            created_at
            updated_at
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id: id});

  return response?.data?.userProfile_SalaryParams?.items[0] || {};
};

export default salaryParamsOverview;

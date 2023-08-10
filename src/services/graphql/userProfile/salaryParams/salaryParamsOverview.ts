import {GraphQL} from '../..';
import {UserProfileGetSalaryParamsResponse} from '../../../../types/graphql/userProfileGetSalaryParams';

const salaryParamsOverview = async (id: number): Promise<UserProfileGetSalaryParamsResponse> => {
  const query = `query UserProfileSalaryParams($user_profile_id: Int!){
    userProfile_SalaryParams(user_profile_id: $user_profile_id) {
        message
        status
        items {
            id
            user_profile_id
            benefited_track
            without_raise
            insurance_basis
            salary_rank
            daily_work_hours
            weekly_work_hours
            education_rank
            education_naming
            user_resolution_id
            created_at
            updated_at
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id: id});

  return response?.data?.userProfile_SalaryParams?.items[0] || {};
};

export default salaryParamsOverview;

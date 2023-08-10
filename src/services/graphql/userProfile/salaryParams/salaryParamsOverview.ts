import {GraphQL} from '../..';
import {UserProfileGetSalaryParamsResponse} from '../../../../types/graphql/userProfileGetSalaryParams';

const salaryParamsOverview = async (id: number): Promise<UserProfileGetSalaryParamsResponse> => {
  const response = await GraphQL.fetch(`query {
   userProfile_SalaryParams(user_profile_id: ${id}) {
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
}`);

  return response?.data?.userProfile_SalaryParams?.items[0] || {};
};

export default salaryParamsOverview;

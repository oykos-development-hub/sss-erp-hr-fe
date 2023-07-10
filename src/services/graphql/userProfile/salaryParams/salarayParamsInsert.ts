import {GraphQL} from '../..';
import {UserProfileInsertSalaryParamsResponse} from '../../../../types/graphql/userProfileInsertSalaryParams';
import {UserProfileGetSalaryParams} from '../../../../types/graphql/userProfileGetSalaryParams';

const salaryParamsInsert = async (
  data: UserProfileGetSalaryParams,
): Promise<UserProfileInsertSalaryParamsResponse['data']['userProfile_SalaryParams_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_SalaryParams_Insert(data: {
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      benefited_track: ${data.benefited_track},
      without_raise: ${data.without_raise},
      insurance_basis: "${data.insurance_basis}",
      salary_rank: "${data.salary_rank}",
      daily_work_hours: "${data.daily_work_hours}",
      weekly_work_hours: "${data.weekly_work_hours}",
      education_rank: "${data.education_rank}",
      education_naming: "${data.education_naming}",
      user_resolution_id: ${data.user_resolution_id},
    }
    ) {
      message
      status
      item {
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
}
`);

  return response?.data?.userProfile_SalaryParams_Insert || {};
};

export default salaryParamsInsert;

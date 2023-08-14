import {GraphQL} from '../..';
import {UserProfileInsertSalaryParamsResponse} from '../../../../types/graphql/userProfileInsertSalaryParams';
import {UserProfileGetSalaryParams} from '../../../../types/graphql/userProfileGetSalaryParams';

const salaryParamsInsert = async (
  data: UserProfileGetSalaryParams,
): Promise<UserProfileInsertSalaryParamsResponse['data']['userProfile_SalaryParams_Insert']> => {
  const mutation = `mutation UserProfileSalaryParamsInsert($data: UserProfileSalaryParamsInsertMutation!){
    userProfile_SalaryParams_Insert(data: $data) {
        message
        data
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
`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.userProfile_SalaryParams_Insert || {};
};

export default salaryParamsInsert;

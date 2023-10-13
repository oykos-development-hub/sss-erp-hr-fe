import {UserProfileGetSalaryParams} from '../../../types/graphql/userProfileGetSalaryParams';
import {parseDateForBackend} from '../../../utils/dateUtils';

export const formatData = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    benefited_track: data?.benefited_track?.id === 'Da' ? true : false,
    without_raise: data?.without_raise?.id === 'Da' ? true : false,
    insurance_basis: data?.insurance_basis?.id,
    obligation_reduction: data?.obligation_reduction?.id,
    weekly_work_hours: data?.weekly_work_hours.id,
    salary_rank: data?.salary_rank.id,
    user_resolution_id: data?.user_resolution_id?.id,
    created_at: parseDateForBackend(data?.created_at),
  };

  delete payload.updated_at;

  return payload;
};

export const initialValues: UserProfileGetSalaryParams = {
  id: 0,
  benefited_track: false,
  without_raise: false,
  insurance_basis: '',
  salary_rank: '',
  obligation_reduction: '',
  weekly_work_hours: '',
  education_rank: '',
  education_naming: '',
};

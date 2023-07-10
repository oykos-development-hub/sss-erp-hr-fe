import {UserProfileGetSalaryParams} from '../../../types/graphql/userProfileGetSalaryParams';

export const formatData = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    benefited_track: data?.benefited_track?.id === 'Da' ? true : false,
    without_raise: data?.without_raise?.id === 'Da' ? true : false,
    insurance_basis: data?.insurance_basis?.id,
    daily_work_hours: data?.daily_work_hours.id,
    weekly_work_hours: data?.weekly_work_hours.id,
    salary_rank: data?.salary_rank.id,
    user_resolution_id: data?.user_resolution_id?.id,
  };

  delete payload.created_at;
  delete payload.updated_at;

  return payload;
};

export const initialValues: UserProfileGetSalaryParams = {
  id: 0,
  user_profile_id: 0,
  benefited_track: false,
  without_raise: false,
  insurance_basis: '',
  salary_rank: '',
  daily_work_hours: '',
  weekly_work_hours: '',
  education_rank: '',
  education_naming: '',
  user_resolution_id: 0,
  created_at: '',
  updated_at: '',
};

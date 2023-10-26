import {ProfileSalaryFormValues, ProfileSalaryInsertParams} from '../../../types/graphql/salaryParams';

export const formatData = (data: ProfileSalaryFormValues) => {
  console.log(data);
  const payload: ProfileSalaryInsertParams = {
    user_profile_id: data.user_profile_id,
    organization_unit_id: data.organization_unit?.id ?? 0,
    id: data.id || 0,
    benefited_track: data.benefited_track?.id === 'Da' ? true : false,
    without_raise: data.without_raise?.id ?? false,
    insurance_basis: data.insurance_basis?.id ?? '',
    obligation_reduction: data.obligation_reduction?.id ?? '',
    weekly_work_hours: data.weekly_work_hours?.id ?? '',
    salary_rank: data.salary_rank?.id ?? '',
    education_naming: data.education_naming,
    education_rank: data.education_rank,
    // daily_work_hours: data.weekly_work_hours?.id ?? '',
    // user_resolution_id: data.user_resolution_id?.id,
    // created_at: parseDateForBackend(data?.created_at),
  };

  if (!data.id) {
    payload.id = 0;
  }

  return payload;
};

export const initialValues: ProfileSalaryFormValues = {
  user_profile_id: 0,
  id: 0,
  benefited_track: null,
  without_raise: null,
  insurance_basis: null,
  salary_rank: null,
  obligation_reduction: null,
  weekly_work_hours: null,
  education_rank: '',
  education_naming: '',
  job_position: null,
  organization_unit: null,
  education_level: '',
  date_of_start: null,
  contract_type: null,
};

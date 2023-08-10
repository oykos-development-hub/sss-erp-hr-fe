import {parseDate} from '../../utils/dateUtils';

export const formatDataSaveSystematization = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    user_profile_id: data?.user_profile_id || 1,
    organization_unit_id: data?.organization_unit?.id,
    date_of_activation: data?.date_of_activation ? parseDate(data?.date_of_activation, true) : '',
    file_id: data?.file_id || 0,
  };

  delete payload.user_profile;
  delete payload.organization_unit;
  delete payload.sectors;
  delete payload.created_at;
  delete payload.updated_at;

  return payload;
};

export const formatDataAddJobPosition = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    available_slots: Number(data?.available_slots?.value) || 1,
    parent_job_position_id: 0,
    job_position_id: data?.job_position?.id,
    system_permission_id: 0,
    description: data?.job_position?.description,
    requirements: data?.job_position?.requirements,
    icon: '',
  };

  delete payload.employees;
  delete payload.job_position;

  return payload;
};

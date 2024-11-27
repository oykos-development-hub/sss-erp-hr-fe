import {parseDateForBackend} from '../../utils/dateUtils';

export const formatSystematization = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    organization_unit_id: data?.organization_unit?.id,
    date_of_activation: parseDateForBackend(data?.date_of_activation),
  };

  delete payload.user_profile;
  delete payload.organization_unit;
  delete payload.sectors;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.active_employees;
  delete payload.file;
  delete payload.files;

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

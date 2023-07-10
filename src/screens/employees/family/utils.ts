import {parseDate} from '../../../utils/dateUtils';

export const formatData = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    handicapped_person: data?.handicapped_person?.id === 'Da' ? true : false,
    insurance_coverage: data?.insurance_coverage?.id === 'Ne' ? 'Ne' : 'Da',
    date_of_birth: parseDate(data?.date_of_birth, true),
    citizenship: data?.citizenship?.title,
    country_of_birth: data?.country_of_birth?.title,
    city_of_birth: data?.city_of_birth?.title,
    employee_relationship: data?.employee_relationship?.title,
    gender: data?.gender?.title,
  };

  delete payload.created_at;
  delete payload.updated_at;

  return payload;
};

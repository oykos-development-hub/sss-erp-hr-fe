import {parseDateForBackend} from '../../../utils/dateUtils';

export const formatData = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    handicapped_person: data?.handicapped_person?.id === 'Da' ? true : false,
    insurance_coverage: data?.insurance_coverage?.id === 'Ne' ? 'Ne' : 'Da',
    date_of_birth: parseDateForBackend(data?.date_of_birth),
    citizenship: data?.citizenship?.title,
    country_of_birth: data?.country_of_birth?.id,
    city_of_birth: typeof data?.city_of_birth === 'string' ? data?.city_of_birth : data?.city_of_birth?.title || '',
    employee_relationship: data?.employee_relationship?.title,
    gender: data?.gender?.title,
    nationality: data?.nationality?.title || '',
    national_minority: data?.national_minority?.id,
  };

  return payload;
};

import {parseDateForBackend} from '../../../utils/dateUtils';

export const formatData = (data: any, newExperience?: boolean) => {
  const payload = {
    ...data,
    relevant: data?.relevant?.id === 'Da' ? true : false,
    organization_unit_id: data?.relevant?.id === 'Da' ? data?.organization_unit_id?.id : null,
    organization_unit: data.organization_unit,
    date_of_start: parseDateForBackend(data?.date_of_start),
    date_of_end: parseDateForBackend(data?.date_of_end),
    amount_of_experience: data?.amount_of_experience,
    amount_of_insured_experience:
      Number(data?.amount_of_insured_experience) >= data?.amount_of_experience
        ? data?.amount_of_experience
        : Number(data?.amount_of_insured_experience),
    reference_file_id: data?.reference_file_id,
  };

  if (newExperience) {
    delete payload.id;
  }

  delete payload.selectedOrganizationUnit;
  delete payload.created_at;
  delete payload.updated_at;

  return payload;
};

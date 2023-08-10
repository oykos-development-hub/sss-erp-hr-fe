import {calculateExperience, parseDate} from '../../../utils/dateUtils';

export const formatData = (data: any, newExperience?: boolean) => {
  const calculatedExperience = calculateExperience(data?.date_of_start, data?.date_of_end);

  console.log(data);

  const payload = {
    ...data,
    relevant: data?.relevant?.id === 'Da' ? true : false,
    organization_unit_id: data?.relevant?.id === 'Da' ? data?.selectedOrganizationUnit?.id : 0,
    organization_unit: data?.relevant?.id === 'Da' ? data?.selectedOrganizationUnit?.title : data.organization_unit,
    date_of_start: parseDate(data?.date_of_start, true),
    date_of_end: parseDate(data?.date_of_end, true),
    date_of_signature: data?.date_of_signature ? parseDate(data?.date_of_signature, true) : parseDate(new Date(), true),
    amount_of_experience: calculatedExperience,
    amount_of_insured_experience:
      Number(data?.amount_of_insured_experience) >= calculatedExperience
        ? calculatedExperience
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

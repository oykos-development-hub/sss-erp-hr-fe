import {parseDateForBackend} from '../../../utils/dateUtils';

export const formatData = (data: any, newExperience?: boolean) => {
  // insured experience is passed as a string with the format 'years-months-days'
  const insuredExperience = data.amount_of_insured_experience.split('-');
  const payload = {
    ...data,
    relevant: data?.relevant?.id === 'Da' ? true : false,
    organization_unit_id: data?.relevant?.id === 'Da' ? data?.organization_unit_id?.id : null,
    organization_unit: data.organization_unit,
    date_of_start: parseDateForBackend(data?.date_of_start),
    date_of_end: parseDateForBackend(data?.date_of_end),
    amount_of_experience: data?.amount_of_experience,
    years_of_insured_experience: +insuredExperience[0],
    months_of_insured_experience: +insuredExperience[1],
    days_of_insured_experience: +insuredExperience[2],
  };

  if (newExperience) {
    delete payload.id;
  }

  if (!insuredExperience.length) {
    delete payload.years_of_insured_experience;
    delete payload.months_of_insured_experience;
    delete payload.days_of_insured_experience;
  }

  delete payload.selectedOrganizationUnit;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.files;
  delete payload.amount_of_insured_experience;
  delete payload.amount_of_experience;
  delete payload.organization_unit_title;

  return payload;
};

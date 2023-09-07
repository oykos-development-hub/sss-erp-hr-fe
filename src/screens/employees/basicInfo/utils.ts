import {yesOrNoOptionsString} from '../../../constants';
import {parseDate} from '../../../utils/dateUtils';

export const formatData = (data: any) => {
  const isNew = !!data?.id;

  const payload: any = {
    first_name: data?.first_name,
    last_name: data?.last_name,
    birth_last_name: data?.birth_last_name,
    address: data?.address,
    father_name: data?.father_name,
    mother_name: data?.mother_name,
    mother_birth_last_name: data?.mother_birth_last_name,
    official_personal_id: data?.official_personal_id,
    official_personal_document_number: data?.official_personal_document_number,
    housing_description: data?.housing_description,
    middle_name: data?.middle_name,
    date_of_birth: parseDate(data?.date_of_birth, true),
    country_of_birth: data?.country_of_birth?.id,
    city_of_birth: data?.city_of_birth,
    nationality: data?.nationality?.id,
    citizenship: data?.citizenship?.id,
    gender: data?.gender?.id,
    single_parent: data?.single_parent.id === 'Da' ? true : false,
    housing_done: data?.housing_done.id === 'Da' ? true : false,
    revisor_role: data?.revisor_role === 'Da' ? true : false,
    marital_status: data?.marital_status?.id,
    date_of_taking_oath: parseDate(new Date(), true),
    // date_of_becoming_judge: parseDate(data?.date_of_becoming_judge, true) || '',
    national_minority: data?.national_minority?.id,
    official_personal_document_issuer: data?.official_personal_document_issuer?.id,
    role_id: 2,
    // user_account_id: 1,
    contract: {
      organization_unit_id: data?.contract?.organization_unit_id?.id || null,
      organization_unit_department_id: data?.contract.department_id?.id || null,
      job_position_in_organization_unit_id: data?.contract?.job_position_in_organization_unit_id?.id || null,
      contract_type_id: data?.contract?.contract_type_id?.id || null,
      date_of_end: data?.contract?.date_of_end ? parseDate(data?.contract?.date_of_end, true) : null,
      date_of_start: parseDate(data?.contract?.date_of_start, true),
      user_profile_id: data?.id,
      active: data?.contract?.active === false ? false : true,
      date_of_eligibility: parseDate(data?.contract.date_of_eligibility, true),
    },
  };

  if (!isNew) {
    payload.password = data?.password;
    payload.email = data?.email;
    payload.pin = data?.pin;
    payload.phone = data?.phone;
    payload.secondary_email = data?.secondary_email;
  }

  return payload;
};

export const booleanToYesOrNo = (value: boolean) => {
  return value !== null ? (value ? yesOrNoOptionsString[0] : yesOrNoOptionsString[1]) : null;
};

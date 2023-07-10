import {parseDate} from '../../../utils/dateUtils';

export const formatData = (data: any) => {
  const payload = {
    ...data,
    id: data?.id || 0,
    first_name: data?.first_name,
    last_name: data?.last_name,
    date_of_birth: parseDate(data?.date_of_birth, true),
    birth_last_name: data?.birth_last_name,
    country_of_birth: data?.country_of_birth?.id,
    city_of_birth: data?.city_of_birth,
    nationality: data?.citizenship?.id ? data?.citizenship?.title : 'Crnogorac',
    citizenship: data?.citizenship?.id,
    address: data?.address,
    father_name: data?.father_name,
    mother_name: data?.mother_name,
    mother_birth_last_name: data?.mother_birth_last_name,
    bank_account: data?.bank_account,
    bank_name: data?.bank_name,
    official_personal_id: data?.official_personal_id,
    official_personal_document_number: data?.official_personal_document_number,
    official_personal_document_issuer: data?.official_personal_document_issuer,
    gender: data?.gender?.id,
    single_parent: data?.single_parent === 'Da' ? true : false,
    housing_done: data?.housing_done === 'Da' ? true : false,
    revisor_role: data?.revisor_role === 'Da' ? true : false,
    benefited_track: data?.benefited_track === 'Da' ? true : false,
    housing_description: data?.housing_description,
    marital_status: data?.marital_status?.id,
    date_of_taking_oath: parseDate(new Date(), true),
    date_of_start: parseDate(data?.date_of_start, true),
    date_of_end: parseDate(data?.date_of_end, true),
    date_of_becoming_judge: parseDate(data?.date_of_becoming_judge, true),
    email: data?.email,
    phone: data?.phone,
    organization_unit_id: data?.organization_unit_id?.id || 0,
    job_position_id: data?.job_position_id?.id || 0,
    contract_type_id: data?.contract_type_id?.id || 0,
    national_minority: data?.national_minority,
    private_email: data?.private_email,
    pin: data?.pin,
    organization_unit_department_id: data?.organization_unit_department_id || 0,
    password: data?.password,
  };

  delete payload.created_at;
  delete payload.updated_at;

  return payload;
};

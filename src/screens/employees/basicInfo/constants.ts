import * as yup from 'yup';

export const initialValues = {
  id: 0,
  first_name: '',
  last_name: '',
  date_of_birth: undefined,
  birth_last_name: '',
  country_of_birth: '',
  city_of_birth: '',
  nationality: undefined,
  citizenship: undefined,
  address: '',
  father_name: '',
  mother_name: '',
  mother_birth_last_name: '',
  official_personal_id: '',
  official_personal_document_number: '',
  official_personal_document_issuer: undefined,
  gender: undefined,
  single_parent: undefined,
  housing_done: undefined,
  revisor_role: false,
  housing_description: '',
  marital_status: undefined,
  date_of_becoming_judge: undefined,
  email: '',
  phone: '',
  national_minority: undefined,
  secondary_email: '',
  pin: '',
  password: '',
  middle_name: '',
  role_id: 0,
  contract: {
    contract_type_id: undefined,
    organization_unit_id: undefined,
    department_id: undefined,
    date_of_start: undefined,
    date_of_end: undefined,
    date_of_eligibility: undefined,
    file_id: undefined,
    job_position_in_organization_unit_id: undefined,
    user_profile_id: undefined,
    active: true,
  },
};

export const dropdownStringSchema = {id: yup.string(), title: yup.string()};
export const dropdownNumberSchema = {id: yup.number(), title: yup.string()};
export const requiredError = 'Ovo polje je obavezno';

export const contractPositions = ['Ugovor na neodređeno vrijeme', 'Ugovor na određeno vrijeme'];

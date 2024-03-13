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
  is_president: false,
  is_judge: false,
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
  judge_application_submission_date: '',
  personal_id: '',
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

export const dropdownStringSchema = {id: yup.string().required(), title: yup.string().required()};
export const dropdownNumberSchema = {id: yup.number().required(), title: yup.string().required()};
export const requiredError = 'Ovo polje je obavezno';

export const contractPositions = ['Na neodređeno vrijeme', 'Na određeno vrijeme'];

export const backendErrors: {[key: string]: string} = {
  user_email_exists: 'Email adresa već postoji u sistemu.',
  user_jmbg_exists: 'JMBG već postoji u sistemu.',
};

import {UserProfileBasicInfo, UserProfileBasicInfoFormValues} from '../../../types/graphql/userProfiles';

export const initialValues: UserProfileBasicInfoFormValues = {
  id: 0,
  first_name: '',
  last_name: '',
  date_of_birth: '',
  birth_last_name: '',
  country_of_birth: '',
  city_of_birth: '',
  nationality: null,
  citizenship: null,
  address: '',
  father_name: '',
  mother_name: '',
  mother_birth_last_name: '',
  official_personal_id: '',
  official_personal_document_number: '',
  official_personal_document_issuer: null,
  gender: null,
  single_parent: null,
  housing_done: null,
  revisor_role: null,
  housing_description: '',
  marital_status: null,
  date_of_becoming_judge: '',
  email: '',
  phone: '',
  national_minority: null,
  secondary_email: '',
  pin: '',
  password: '',
  middle_name: '',
  role_id: 0,
  contract: {
    contract_type_id: null,
    organization_unit_id: null,
    department_id: null,
    date_of_start: '',
    date_of_end: '',
    date_of_eligibility: '',
    file_id: null,
    job_position_in_organization_unit_id: null,
    user_profile_id: null,
    active: true,
  },
};

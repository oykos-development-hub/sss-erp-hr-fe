import {yesOrNoOptionsString} from '../../../constants';
import * as yup from 'yup';
import {dropdownNumberSchema, dropdownStringSchema, requiredError} from './constants';
import {parseDateForBackend} from '../../../utils/dateUtils';

export const formatData = (data: any) => {
  const isNew = !data?.id;

  const payload: any = {
    id: data?.id,
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
    date_of_birth: parseDateForBackend(data?.date_of_birth),
    country_of_birth: data?.country_of_birth?.id,
    city_of_birth: data?.city_of_birth,
    nationality: data?.nationality?.id,
    citizenship: data?.citizenship?.id,
    gender: data?.gender?.id,
    single_parent: data?.single_parent.id === 'Da' ? true : false,
    housing_done: data?.housing_done.id === 'Da' ? true : false,
    is_president: data?.is_president,
    is_judge: data?.is_judge,
    marital_status: data?.marital_status?.id,
    date_of_taking_oath: new Date(),
    national_minority: data?.national_minority?.id,
    official_personal_document_issuer: data?.official_personal_document_issuer?.id,
    contract: {
      organization_unit_id: data?.organization_unit_id?.id || null,
      organization_unit_department_id: data?.department_id?.id || null,
      job_position_in_organization_unit_id: data?.job_position_in_organization_unit_id?.id || null,
      contract_type_id: data?.contract_type_id?.id || null,
      date_of_end: data?.date_of_end ? parseDateForBackend(data?.date_of_end) : null,
      date_of_start: parseDateForBackend(data?.date_of_start),
      user_profile_id: data?.id,
      active: data?.active === false ? false : true,
      date_of_eligibility: parseDateForBackend(data?.date_of_eligibility),
      number_of_conference: data?.number_of_conference,
    },
  };

  if (isNew) {
    delete payload.id;
    payload.password = data?.password;
    payload.email = data?.email;
    payload.pin = data?.pin;
    payload.phone = data?.phone;
    payload.secondary_email = data?.secondary_email;
    payload.role_id = 2;
  }

  return payload;
};

export const booleanToYesOrNo = (value: boolean) => {
  return value !== null ? (value ? yesOrNoOptionsString[0] : yesOrNoOptionsString[1]) : undefined;
};

export const validateDateOfBirth = (jmbg: string, dateOfBirth: Date) => {
  let year = jmbg.substring(4, 7);

  const millennium = year.charAt(0) === '0' ? 2 : 1;
  year = `${millennium}${year}`;

  const month = jmbg.substring(2, 4);
  const day = jmbg.substring(0, 2);

  const jmbgDateOfBirth = new Date(`${month}/${day}/${year}`);

  return (
    jmbgDateOfBirth.getFullYear() === dateOfBirth.getFullYear() &&
    jmbgDateOfBirth.getMonth() === dateOfBirth.getMonth() &&
    jmbgDateOfBirth.getDate() === dateOfBirth.getDate()
  );
};

export const basicInfoSchema = yup.object({
  id: yup.number(),
  first_name: yup.string().required(requiredError),
  last_name: yup.string().required(requiredError),
  date_of_birth: yup
    .date()
    .test('more than 18 year old', 'Zaposleni mora biti punoljetan', value => {
      if (!value) return true;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    })
    .test({
      name: 'is same as date in jmbg',
      message: 'Datum rođenja mora da se poklapa sa JMBG-om',
      test: function (value) {
        if (!value || !this.parent.official_personal_id) return true;
        return validateDateOfBirth(this.parent.official_personal_id, value);
      },
    })
    .required(requiredError)
    .nullable(),
  birth_last_name: yup.string(),
  country_of_birth: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  city_of_birth: yup.lazy(value => {
    switch (typeof value) {
      case 'object':
        return yup.object(dropdownStringSchema).required(requiredError).default(undefined);
      case 'string':
        return yup.string().required(requiredError);
      default:
        return yup.object(dropdownStringSchema).default(undefined);
    }
  }),
  nationality: yup.object(dropdownStringSchema).default(undefined),
  citizenship: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  national_minority: yup.object(dropdownStringSchema).nullable(),
  address: yup.string().required(requiredError),
  father_name: yup.string().required(requiredError),
  mother_name: yup.string().required(requiredError),
  mother_birth_last_name: yup.string(),
  personal_id: yup.string(),
  official_personal_id: yup.string().required(requiredError).default(undefined),
  official_personal_document_number: yup.string().required(requiredError).default(undefined),
  official_personal_document_issuer: yup
    .object()
    .shape(dropdownStringSchema)
    .required(requiredError)
    .default(undefined),
  gender: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  single_parent: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  housing_done: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  is_president: yup.boolean().default(false),
  is_judge: yup.boolean().default(false),
  housing_description: yup.string(),
  marital_status: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  date_of_becoming_judge: yup.date().nullable(),
  middle_name: yup.string(),
  organization_unit_id: yup.object(dropdownNumberSchema).required(requiredError).default(undefined),
  department_id: yup
    .object(dropdownNumberSchema)
    .nullable()
    .when('is_judge', {
      is: false,
      then: schema => schema.required(requiredError),
    })
    .default(undefined),
  job_position_in_organization_unit_id: yup.object(dropdownNumberSchema).nullable().default(undefined),
  contract_type_id: yup.object(dropdownNumberSchema).required(requiredError).default(undefined),
  date_of_end: yup.date().nullable(),
  date_of_start: yup.date().required(requiredError).nullable(),
  date_of_eligibility: yup.date().required(requiredError).nullable(),
  user_profile_id: yup
    .number()
    .when('id', {is: (id: number) => id > 0, then: schema => schema.required(requiredError)}),
  active: yup.boolean(),
  email: yup
    .string()
    .email('Nije validan e-mail')
    .when('id', {is: undefined, then: schema => schema.required(requiredError)}),
  phone: yup.string().when('id', {
    is: undefined,
    then: schema => schema.required(requiredError),
  }),
  secondary_email: yup
    .string()
    .email('Nije validan e-mail')
    .when('id', {is: undefined, then: schema => schema.required(requiredError)}),
  pin: yup
    .string()
    .matches(/^(0|[1-9]\d*)(\.\d+)?$/, 'Ovo polje je obavezno')
    .when('id', {is: undefined, then: schema => schema.required(requiredError)}),
  password: yup.string().when('id', {is: undefined, then: schema => schema.required(requiredError)}),
  number_of_conference: yup.string(),
});

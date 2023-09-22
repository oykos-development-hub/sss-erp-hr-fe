import {UserProfileEducationFormValues} from '../../../types/graphql/userProfileGetEducation';

export const initialValues: UserProfileEducationFormValues = {
  id: 0,
  title: '',
  user_profile_id: 0,
  type: null,
  date_of_certification: null,
  price: 0,
  date_of_start: null,
  date_of_end: null,
  academic_title: null,
  expertise_level: '',
  certificate_issuer: '',
  description: '',
  file_id: 0,
  score: '',
};

export enum educationTypes {
  education_academic_types = 'education_academic_types',
  education_language_types = 'education_language_types',
  education_functional_types = 'education_functional_types',
  education_exam_types = 'education_exam_types',
}
export enum resolutionTypes {
  resolution_types = 'resolution_types',
}

export const academicTitles = [
  {
    id: 'Osnovna stručna sprema',
    title: 'Osnovna stručna sprema',
  },
  {
    id: 'Srednja stručna sprema',
    title: 'Srednja stručna sprema',
  },
  {
    id: 'Viša stručna sprema',
    title: 'Viša stručna sprema',
  },
  {
    id: 'Visoka stručna sprema',
    title: 'Visoka stručna sprema',
  },
  {
    id: 'Postdiplomske studije i doktorske studije',
    title: 'Postdiplomske studije i doktorske studije',
  },
];

export const languageAcknowledgmentLevels = [
  {id: 'A1 - Beginner', title: 'A1 - Beginner'},
  {id: 'A2 - Elementary', title: 'A2 - Elementary'},
  {id: 'B1 - Intermediate', title: 'B1 - Intermediate'},
  {id: 'B2 - Upper-Intermediate', title: 'B2 - Upper-Intermediate'},
  {id: 'C1 - Advanced', title: 'C1 - Advanced'},
  {id: 'C2 - Proficient User', title: 'C2 - Proficient User'},
];

import {UserProfileEducationFormValues} from '../../../types/graphql/userProfileGetEducation';

export const initialValues: UserProfileEducationFormValues = {
  id: 0,
  title: '',
  user_profile_id: 0,
  type: null,
  date_of_certification: '',
  price: 0,
  date_of_start: '',
  date_of_end: '',
  academic_title: null,
  expertise_level: '',
  certificate_issuer: '',
  description: '',
  file_id: 0,
};

export enum educationTypes {
  education_academic_types = 'education_academic_types',
  education_language_types = 'education_language_types',
  education_functional_types = 'education_functional_types',
  education_exam_types = 'education_exam_types',
}

export const academicTitles = [
  {
    id: '0-Doktor nauka',
    title: '0-Doktor nauka',
  },
  {
    id: '1-Magistar nauka',
    title: '1-Magistar nauka',
  },
  {
    id: '2-Visoka stručna sprema',
    title: '2-Visoka stručna sprema',
  },
  {
    id: '3-Viša stručna sprema',
    title: '3-Viša stručna sprema',
  },
  {
    id: '4-Srednja stručna sprema',
    title: '4-Srednja stručna sprema',
  },
  {
    id: '5-Niža stručna sprema',
    title: '5-Niža stručna sprema',
  },
  {
    id: '6-Visokokvalifikovani radnik',
    title: '6-Visokokvalifikovani radnik',
  },
  {
    id: '7-Kvalifikovani radnik',
    title: '7-Kvalifikovani radnik',
  },
  {
    id: '7-Polukvalifikovani radnik',
    title: '7-Polukvalifikovani radnik',
  },
  {
    id: '7-Nekvalifikovani radnik',
    title: '7-Nekvalifikovani radnik',
  },
];

export const languages = [
  {id: 'Engleski', title: 'Engleski'},
  {id: 'Francuski', title: 'Francuski'},
  {id: 'Ruski', title: 'Ruski'},
  {id: 'Njemacki', title: 'Njemacki'},
];

export const languageAcknowledgmentLevels = [
  {id: 'A1 - Beginner', title: 'A1 - Beginner'},
  {id: 'A2 - Elementary', title: 'A2 - Elementary'},
  {id: 'B1 - Intermediate', title: 'B1 - Intermediate'},
  {id: 'B2 - Upper-Intermediate', title: 'B2 - Upper-Intermediate'},
  {id: 'C1 - Advanced', title: 'C1 - Advanced'},
  {id: 'C2 - Proficient User', title: 'C2 - Proficient User'},
];

export const examTypes = [
  {id: 'Državni ispit', title: 'Državni ispit'},
  {id: 'Stručni ispit', title: 'Stručni ispit'},
  {id: 'Pravosudni ispit', title: 'Pravosudni ispit'},
];

export const functionalAcknowledgmentGrades = [
  {
    id: 'Položio',
    title: 'Položio',
  },
  {id: 'Nije položio', title: 'Nije položio'},
];

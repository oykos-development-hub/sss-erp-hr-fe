import * as yup from 'yup';

export const evaluationSchema = yup.object().shape({
  date_of_evaluation: yup.date().required('Ovo polje je obavezno'),
  is_relevant: yup
    .object()
    .shape({id: yup.string().required(), title: yup.string().required()})
    .required('Ovo polje je obavezno')
    .nullable(),
  evaluation_type_id: yup
    .object()
    .shape({id: yup.number().required(), title: yup.string().required()})
    .required('Ovo polje je obavezno')
    .nullable(),
  user_profile_id: yup.number().required('Ovo polje je obavezno'),
  evaluation_period: yup.string(),
  reason_for_evaluation: yup.object().shape({
    id: yup.string(),
    title: yup.string(),
  }),
  file_id: yup.number(),
  decision_number: yup.string(),
});

export const ReasonForAssessment = [
  {id: 1, title: 'Izbor predsjednika'},
  {id: 2, title: 'Napredovanje'},
  {id: 3, title: 'Preocjenjivanje'},
  {id: 4, title: 'Redovno ocjenjivanje'},
];

import React from 'react';
import {AcademicEducationTable} from '../../../components/education/tables/academicEducationTable';
import {FunctionalAcknowledgmentTable} from '../../../components/education/tables/functionalAcknowledgementsTable';
import {JudicalAndStateExamsTable} from '../../../components/education/tables/judicalAndStateExamsTable';
import {LanguageAcknowledgmentTable} from '../../../components/education/tables/languageAcknowledgementsTable';
import { EducationContainer} from './styles';
import {EducationPageProps} from './types';

export const EducationPage: React.FC<EducationPageProps> = props => {
  const languages = props.context.countries;
  const alert = props.context.alert;
 
  return (
    <EducationContainer>
      <AcademicEducationTable alert={alert}  />
      <LanguageAcknowledgmentTable languages={languages} alert={alert} />
      <FunctionalAcknowledgmentTable  alert={alert}/>
      <JudicalAndStateExamsTable  alert={alert}/>
    </EducationContainer>
  );
};

import React from 'react';
import {AcademicEducationTable} from '../../../components/education/tables/academicEducationTable';
import {FunctionalAcknowledgmentTable} from '../../../components/education/tables/functionalAcknowledgementsTable';
import {JudicalAndStateExamsTable} from '../../../components/education/tables/judicalAndStateExamsTable';
import {LanguageAcknowledgmentTable} from '../../../components/education/tables/languageAcknowledgementsTable';
import {EducationContainer} from './styles';
import {EducationPageProps} from './types';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

export const EducationPage: React.FC<EducationPageProps> = props => {
  const languages = props.context.countries;
  const alert = props.context.alert;
  const navigation = props.context.navigation;
  const updatePermittedRoutes = checkActionRoutePermissions(props.context.contextMain?.permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/employees');

  return (
    <EducationContainer>
      <AcademicEducationTable alert={alert} navigation={navigation} updatePermission={updatePermission} />
      <LanguageAcknowledgmentTable
        languages={languages}
        alert={alert}
        navigation={navigation}
        updatePermission={updatePermission}
      />
      <FunctionalAcknowledgmentTable alert={alert} navigation={navigation} updatePermission={updatePermission} />
      <JudicalAndStateExamsTable alert={alert} navigation={navigation} updatePermission={updatePermission} />
    </EducationContainer>
  );
};

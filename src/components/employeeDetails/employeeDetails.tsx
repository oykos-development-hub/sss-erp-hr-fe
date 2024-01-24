import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import useAppContext from '../../context/useAppContext';
import Absents from '../../screens/employees/absents/absents';
import {BasicInfo} from '../../screens/employees/basicInfo/basicInfo';
import {ConfirmationsPage} from '../../screens/employees/confirmations/confirmations';
import {employeeTabs} from '../../screens/employees/constants';
import {EducationPage} from '../../screens/employees/education/education';
import {EvaluationsPage} from '../../screens/employees/evaluations/evaluations';
import {ExperiencePage} from '../../screens/employees/experience/experience';
import {FamilyPage} from '../../screens/employees/family/family';
import Foreigners from '../../screens/employees/foreigners/foreigners';
import {SalaryParams} from '../../screens/employees/salaryParams/salaryParams';
import {getRouteName} from '../../utils/getRouteName';
import {EmployeeDetailsBox, StyledTabs} from './styles';

const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return employeeTabs.find(tab => tab.routeName === name)?.id;
};

const EmployeeDetails: React.FC = () => {
  const context = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(context.navigation.location.pathname) || 1);
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = context;

  const employeesPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = context.navigation.location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const employeesRoute = useMemo(() => {
    switch (employeesPath) {
      case 'basic-info':
        return <BasicInfo />;
      case 'salary-params':
        return <SalaryParams context={context} />;
      case 'education':
        return <EducationPage context={context} />;
      case 'experience':
        return <ExperiencePage context={context} />;
      case 'family-members':
        return <FamilyPage context={context} />;
      case 'foreigner-permits':
        return <Foreigners context={context} />;
      case 'confirmations':
        return <ConfirmationsPage context={context} />;
      case 'evaluations':
        return <EvaluationsPage />;
      case 'absents':
        return <Absents context={context} />;
      default:
        return <></>;
    }
  }, [employeesPath, context]);

  useEffect(() => {
    setActiveTab(getCurrentTab(context.navigation.location.pathname) || 1);
  }, [context.navigation.location.pathname]);

  // TODO: find a better way of handling this
  if (employeesPath === 'employees') {
    return null;
  }

  return (
    <EmployeeDetailsBox>
      <StyledTabs
        tabs={employeeTabs}
        activeTab={activeTab}
        onChange={onTabChange}
        //TODO: change in devkit/library
        style={{borderWidth: '1px', borderRadius: '0.5em 0.5em 0 0', whiteSpace: 'nowrap'}}
      />
      {employeesRoute}
    </EmployeeDetailsBox>
  );
};

export default EmployeeDetails;

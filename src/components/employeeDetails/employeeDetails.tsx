import React, {useEffect, useMemo, useState, RefObject, useRef} from 'react';
import {EmployeeDetailsBox, StyledTabs} from './styles';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {employeeTabs} from '../../screens/employees/constants';
import {getRouteName} from '../../utils/getRouteName';
import {MicroserviceProps} from '../../types/micro-service-props';
import {BasicInfo} from '../../screens/employees/basicInfo/basicInfo';
import {EducationPage} from '../../screens/employees/education/education';
import {ExperiencePage} from '../../screens/employees/experience/experience';
import {FamilyPage} from '../../screens/employees/family/family';
import Foreigners from '../../screens/employees/foreigners/foreigners';
import {ConfirmationsPage} from '../../screens/employees/confirmations/confirmations';
import {EvaluationsPage} from '../../screens/employees/evaluations/evaluations';
import {SalaryParams} from '../../screens/employees/salaryParams/salaryParams';
import Absents from '../../screens/employees/absents/absents';
import {scrollToTheNextElement} from '../../utils/scrollToTheNextElement';

interface EmployeeDetailsProps {
  context: MicroserviceProps;
}

const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return employeeTabs.find(tab => tab.routeName === name)?.id;
};

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({context}) => {
  const [activeTab, setActiveTab] = useState(getCurrentTab(context.navigation.location.pathname) || 1);
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = context;
  const detailsRef = useRef<HTMLDivElement>(null);

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
        return <EvaluationsPage context={context} />;
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

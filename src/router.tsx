import React from 'react';
import {LandingScreen} from './screens/landing';
import {EmployeesScreen} from './screens/employees';
import {SystematizationScreen} from './screens/systematization';
import {MicroserviceProps} from './types/micro-service-props';
import {NotFound404} from './screens/404';
import {OrganizationUnitsScreen} from './screens/organization-units';
import {SystematizationDetails} from './screens/systematization/systematizationDetails/systematizationDetails';
import InternalRevision from './screens/internalRevision';
import JudgeNorms from './screens/judges/judgeNorms/judges';
import JudgesNumberDecisions from './screens/judges/judgesNumberDecisions/judgesNumberDecision';
import {JobTendersScreen} from './screens/jobTenders';
import ApplicationDetailsScreen from './screens/jobTenders/applicationDetails/applicationDetails';
import ApplicationsScreen from './screens/jobTenders/applications/applications';
import {JobTenderDetailsScreen} from './screens/jobTenders/jobTenderDetails/jobTenderDetails';
import {JudgesNumbersDetails} from './screens/judges/judgesDecisionDetails/judgesDecisionDetails';
import Judges from './screens/judges/landing';
import JobTenders from './screens/jobTenders/landing';

const employeesRegex = /^\/hr\/employees/;
const systematizationDetailsRegex = /^\/hr\/systematization\/systematization-details(?:\/(\d+))?$/;
const JobTendersRegex = /^\/hr\/job-tenders\/job-tenders-list$/;
const JobTendersDetailsRegex = /^\/hr\/job-tenders\/job-tenders-list\/\d+/;
const ApplicationsRegex = /^\/hr\/job-tenders\/job-tender-applications$/;
const ApplicationsDetailsRegex = /^\/hr\/job-tenders\/job-tender-applications\/\d+/;
const judgesNumberDetailsRegex = /^\/hr\/judges\/number-decision\/\d+/;

export const Router: React.FC<MicroserviceProps> = props => {
  const pathname = props?.navigation?.location?.pathname;
  const context = Object.freeze({
    ...props,
  });

  const renderScreen = () => {
    if (pathname === '/hr') return <LandingScreen context={context} />;
    if (pathname === '/hr/organization-units') return <OrganizationUnitsScreen context={context} />;
    if (employeesRegex.test(pathname)) return <EmployeesScreen context={context} />;
    if (pathname === '/hr/systematization') return <SystematizationScreen context={context} />;
    if (pathname === '/hr/revision-recommendations') return <InternalRevision context={context} />;
    if (pathname === '/hr/job-positions') return <LandingScreen context={context} />;
    if (JobTendersRegex.test(pathname)) return <JobTendersScreen context={context} />;
    if (JobTendersDetailsRegex.test(pathname)) return <JobTenderDetailsScreen context={context} />;
    if (ApplicationsRegex.test(pathname)) return <ApplicationsScreen context={context} />;
    if (ApplicationsDetailsRegex.test(pathname)) return <ApplicationDetailsScreen context={context} />;
    if (systematizationDetailsRegex.test(pathname)) return <SystematizationDetails context={context} />;
    if (pathname === '/hr/judges') return <Judges />;
    if (pathname === '/hr/judges/number-decision') return <JudgesNumberDecisions context={context} />;
    if (pathname === '/hr/judges/number-decision/new-decision')
      return <JudgesNumbersDetails context={context} isNew={true} />;
    if (judgesNumberDetailsRegex.test(pathname)) return <JudgesNumbersDetails context={context} />;
    if (pathname === '/hr/judges/overview-judges-presidents') return <JudgeNorms context={context} />;
    if (pathname === '/hr/job-tenders') return <JobTenders />;

    return <NotFound404 context={context} />;
  };

  return renderScreen();
};

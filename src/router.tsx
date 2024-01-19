import React from 'react';
import HR from './screens/landing';
import {EmployeesScreen} from './screens/employees';
import Systematizations from './screens/systematization';
import {MicroserviceProps} from './types/micro-service-props';
import {NotFound404} from './screens/404';
import {SystematizationDetails} from './screens/systematization/systematizationDetails/index.tsx';
import JudgeNorms from './screens/judges/judgeNorms/judges';
import JudgesNumberDecisions from './screens/judges/judgesNumberDecisions/judgesNumberDecision';
import {JobTendersScreen} from './screens/jobTenders';
import ApplicationDetailsScreen from './screens/jobTenders/applicationDetails/applicationDetails';
import ApplicationsScreen from './screens/jobTenders/applications/applications';
import {JobTenderDetailsScreen} from './screens/jobTenders/jobTenderDetails/jobTenderDetails';
import {JudgesNumbersDetails} from './screens/judges/judgesDecisionDetails/judgesDecisionDetails';
import {AddNewEmployee} from './screens/employees/addNew/addNew';
import Judges from './screens/judges/landing';
import JobTenders from './screens/jobTenders/landing';
import RevisionPlansList from './screens/internalRevision/revisionsPlans/revisionsPlansList';
import RevisionList from './screens/internalRevision/revisions/revisions';
import RevisionTips from './screens/internalRevision/revisionTips/revisionTips';
import {ReportsScreen} from './screens/reports/index.tsx';
import {LandingPage} from './screens/landingPage/landingPage.tsx';

const employeesRegex = /\/hr\/employees(?!\/add-new)(\/.)?/;
const systematizationDetailsRegex = /^\/hr\/systematization\/systematization-details(?:\/(\d+))?$/;
const JobTendersRegex = /^\/hr\/job-tenders\/job-tenders-list$/;
const JobTendersDetailsRegex = /^\/hr\/job-tenders\/job-tenders-list\/\d+/;
const ApplicationsRegex = /^\/hr\/job-tenders\/job-tender-applications$/;
const ApplicationsDetailsRegex = /^\/hr\/job-tenders\/job-tender-applications\/\d+/;
const judgesNumberDetailsRegex = /^\/hr\/judges\/number-decision\/\d+/;
const revisionsRegex = /^\/hr\/revision-recommendations\/\d+\/revision/;
const recommendationsRegex = /^\/hr\/revision-recommendations\/\d+\/revision\/\d+\/recommendations/;

export const Router: React.FC<MicroserviceProps> = props => {
  const pathname = props?.navigation?.location?.pathname;
  const context = Object.freeze({
    ...props,
  });

  const renderScreen = () => {
    if (pathname === '/hr') return <LandingPage />;
    if (employeesRegex.test(pathname)) return <EmployeesScreen context={context} />;
    if (pathname === '/hr/systematization') return <Systematizations />;
    if (pathname === '/hr/revision-recommendations') return <RevisionPlansList context={context} />;
    if (recommendationsRegex.test(pathname)) return <RevisionTips context={context} />;
    if (revisionsRegex.test(pathname)) return <RevisionList context={context} />;
    // if (pathname === '/hr/job-positions') return <LandingScreen context={context} />;
    if (JobTendersRegex.test(pathname)) return <JobTendersScreen context={context} />;
    if (JobTendersDetailsRegex.test(pathname)) return <JobTenderDetailsScreen context={context} />;
    if (ApplicationsRegex.test(pathname)) return <ApplicationsScreen context={context} />;
    if (ApplicationsDetailsRegex.test(pathname)) return <ApplicationDetailsScreen context={context} />;
    if (systematizationDetailsRegex.test(pathname)) return <SystematizationDetails />;
    if (pathname === '/hr/judges') return <Judges />;
    // if (pathname === '/hr/judges') return context.navigation.navigate('judges/number-decision');
    if (pathname === '/hr/judges/number-decision') return <JudgesNumberDecisions context={context} />;
    if (pathname === '/hr/judges/number-decision/new-decision') return <JudgesNumbersDetails isNew={true} />;
    if (judgesNumberDetailsRegex.test(pathname)) return <JudgesNumbersDetails />;
    if (pathname === '/hr/judges/overview-judges-presidents') return <JudgeNorms context={context} />;
    if (pathname === '/hr/job-tenders') return <JobTenders />;
    // if (pathname === '/hr/job-tenders') return context.navigation.navigate('job-tenders/job-tenders-list');
    if (pathname === '/hr/employees/add-new') return <AddNewEmployee context={context} />;
    if (pathname === '/hr/reports') return <ReportsScreen />;

    return <NotFound404 context={context} />;
  };

  return renderScreen();
};

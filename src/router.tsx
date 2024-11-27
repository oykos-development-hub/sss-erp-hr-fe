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
import RevisionPlansList from './screens/internalRevision/revisionsPlans/revisionsPlansList';
import RevisionList from './screens/internalRevision/revisions/revisions';
import RevisionTips from './screens/internalRevision/revisionTips/revisionTips';
import {ReportsScreen} from './screens/reports/index.tsx';
import {LandingPage} from './screens/landingPage/landingPage.tsx';
import {Judges} from './screens/judges/landing.tsx';
import {JobTenders} from './screens/jobTenders/landing.tsx';
import {checkActionRoutePermissions, checkRoutePermissions} from './services/checkRoutePermissions.ts';
import RevisionTipImplementations from './screens/internalRevision/revisionTipImplementations/revisionTipImplementations.tsx';

const employeesRegex = /\/hr\/employees(?!\/add-new)(\/.)?/;
const systematizationDetailsRegex = /^\/hr\/systematization\/systematization-details(?:\/(\d+))?$/;
const JobTendersRegex = /^\/hr\/job-tenders\/job-tenders-list$/;
const JobTendersDetailsRegex = /^\/hr\/job-tenders\/job-tenders-list\/\d+/;
const ApplicationsRegex = /^\/hr\/job-tenders\/job-tender-applications$/;
const ApplicationsDetailsRegex = /^\/hr\/job-tenders\/job-tender-applications\/\d+/;
const judgesNumberDetailsRegex = /^\/hr\/judges\/number-decision\/\d+/;
const revisionsRegex = /^\/hr\/revision-recommendations\/\d+\/revision/;
const recommendationsRegex = /^\/hr\/revision-recommendations\/\d+\/revision\/\d+\/recommendations/;
const recommendationImplementationsRegex = /^\/hr\/revision-recommendations\/\d+\/revision\/\d+\/recommendations\/\d+\/implementation/;

export const Router: React.FC<MicroserviceProps> = props => {
  const pathname = props?.navigation?.location?.pathname;
  const context = Object.freeze({
    ...props,
  });
  const allowedRoutes = checkRoutePermissions(context?.contextMain?.permissions);
  const createPermittedRoutes = checkActionRoutePermissions(context?.contextMain?.permissions, 'create');

  const renderScreen = () => {
    if (pathname === '/hr' && allowedRoutes.includes('/hr')) return <LandingPage />;
    if (employeesRegex.test(pathname) && allowedRoutes.includes('/hr/employees'))
      return <EmployeesScreen context={context} />;
    if (
      pathname === '/hr/employees/add-new' &&
      allowedRoutes.includes('/hr/employees') &&
      createPermittedRoutes.includes('/hr/employees')
    )
      return <AddNewEmployee context={context} />;
    if (pathname === '/hr/systematization' && allowedRoutes.includes('/hr/systematization'))
      return <Systematizations />;
    if (systematizationDetailsRegex.test(pathname) && allowedRoutes.includes('/hr/systematization'))
      return <SystematizationDetails />;
    if (pathname === '/hr/revision-recommendations' && allowedRoutes.includes('/hr/revision-recommendations'))
      return <RevisionPlansList context={context} />;
    if (recommendationImplementationsRegex.test(pathname) && allowedRoutes.includes('/hr/revision-recommendations'))
      return <RevisionTipImplementations />;
    if (recommendationsRegex.test(pathname) && allowedRoutes.includes('/hr/revision-recommendations'))
      return <RevisionTips context={context} />;
    if (revisionsRegex.test(pathname) && allowedRoutes.includes('/hr/revision-recommendations'))
      return <RevisionList context={context} />;
    if (JobTendersRegex.test(pathname) && allowedRoutes.includes('/hr/job-tenders'))
      return <JobTendersScreen context={context} />;
    if (pathname === '/hr/job-tenders' && allowedRoutes.includes('/hr/job-tenders')) return <JobTenders />;
    if (JobTendersDetailsRegex.test(pathname) && allowedRoutes.includes('/hr/job-tenders'))
      return <JobTenderDetailsScreen context={context} />;
    if (ApplicationsRegex.test(pathname) && allowedRoutes.includes('/hr/job-tenders/job-tender-applications'))
      return <ApplicationsScreen context={context} />;
    if (ApplicationsDetailsRegex.test(pathname) && allowedRoutes.includes('/hr/job-tenders/job-tender-applications'))
      return <ApplicationDetailsScreen context={context} />;
    if (pathname === '/hr/judges' && allowedRoutes.includes('/hr/judges')) return <Judges />;
    if (pathname === '/hr/judges/number-decision' && allowedRoutes.includes('/hr/judges/number-decision'))
      return <JudgesNumberDecisions context={context} />;
    if (pathname === '/hr/judges/number-decision/new-decision' && allowedRoutes.includes('/hr/judges/number-decision'))
      return <JudgesNumbersDetails isNew={true} />;
    if (judgesNumberDetailsRegex.test(pathname) && allowedRoutes.includes('/hr/judges/number-decision'))
      return <JudgesNumbersDetails />;
    if (
      pathname === '/hr/judges/overview-judges-presidents' &&
      allowedRoutes.includes('/hr/judges/overview-judges-presidents')
    )
      return <JudgeNorms context={context} />;
    if (pathname === '/hr/reports' && allowedRoutes.includes('/hr/reports')) return <ReportsScreen />;

    return <NotFound404 context={context} />;
  };

  return renderScreen();
};

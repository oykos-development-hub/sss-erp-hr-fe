import {getEnvironment} from '../get-environment';
import deleteForeignerPermit from './foreignerPermits/deleteForeignerPermit';
import getForeignerPermits from './foreignerPermits/getForeignerPermits';
import insertForeignerPermit from './foreignerPermits/insertForeignerPermit';
import {
  default as getAvailableJobPositions,
  default as jobPositionsAvailableOrganizationUnit,
} from './jobPositions/getAvailableJobPositions';
import getJobPositions from './jobPositions/getJobPositions';
import deleteJobPositionInOrgUnit from './jobPositionsInOrgUnit/deleteJobPositionInOrgUnit';
import getJobPositionsInOrgUnit from './jobPositionsInOrgUnit/getJobPositionsInOrgUnit';
import insertJobPositionInOrgUnit from './jobPositionsInOrgUnit/insertJobPositionInOrgUnit';
import deleteJobTenderApplication from './jobTenderApplications/deleteJobTenderApplication';
import getJobTenderApplications from './jobTenderApplications/getJobTenderApplications';
import insertJobTenderApplication from './jobTenderApplications/insertJobTenderApplication';
import getJobTenderTypes from './jobTenderTypes/getJobTenderTypes';
import deleteJobTender from './jobTenders/deleteJobTender';
import getJobTenders from './jobTenders/getJobTenders';
import insertJobTender from './jobTenders/insertJobTender';
import getJudgeAvailability from './judges/getJudgeAvailability';
import getJudges from './judges/getJudges';
import deleteJudgeNorm from './judges/norms/deleteJudgeNorm';
import insertJudgeNorm from './judges/norms/insertJudgeNorm';
import deleteJudgeResolution from './judges/resolutions/deleteJudgeResolution';
import getCurrentResolutionNumbers from './judges/resolutions/getCurrentResolutionNumbers';
import getJudgeResolutions from './judges/resolutions/getJudgeResolutions';
import insertJudgeResolution from './judges/resolutions/insertJudgeResolution';
import employeeInOrganizationUnitDelete from './organizationUnitsEmployees/employeeInOrganizationUnitDelete';
import employeeInOrganizationUnitInsert from './organizationUnitsEmployees/employeeInOrganizationUnitInsert';
import deleteRevision from './revision/deleteRevision';
import getRevisionDetails from './revision/getRevisionDetails';
import getRevisions from './revision/getRevisions';
import insertRevision from './revision/insertRevision';
import deleteRevisionTip from './revisionTips/deleteRevisionTip';
import getRevisionTipDetails from './revisionTips/getRevisionTipDetails';
import getRevisionTips from './revisionTips/getRevisionTips';
import insertRevisionTip from './revisionTips/insertRevisionTip';
import deleteRevisionPlan from './revisionsPlans/deleteRevisionPlan';
import getRevisionPlanDetails from './revisionsPlans/getRevisionPlanDetails';
import getRevisionPlans from './revisionsPlans/getRevisionPlans';
import insertRevisionPlan from './revisionsPlans/insertRevisionPlan';
import settingsDropdownOverview from './settingsDropdown/settingsDropdownOverview';
import systematizationDelete from './systematization/deleteSystematization';
import systematizationDetails from './systematization/getSystematizationDetails';
import getSystematizations from './systematization/getSystematizations';
import insertSystematization from './systematization/insertSystematization';
import terminateEmployment from './terminateEmployment/terminateEmployment';
import absentDelete from './userProfile/absents/deleteAbsence';
import absentOverview from './userProfile/absents/getAbsence';
import absentTypesOverview from './userProfile/absents/getAbsenceTypes';
import insertAbsence from './userProfile/absents/insertAbsence';
import getBasicInfo from './userProfile/basicInfo/getBasicInfo';
import insertBasicInfo from './userProfile/basicInfo/insertBasicInfo';
import updateBasicInfo from './userProfile/basicInfo/updateBasicInfo';
import deleteEducation from './userProfile/education/deleteEducation';
import getEducation from './userProfile/education/getEducation';
import insertEducation from './userProfile/education/insertEducation';
import deleteEvaluation from './userProfile/evaluation/deleteEvaluation';
import getEvaluations from './userProfile/evaluation/getEvaluations';
import insertEvaluation from './userProfile/evaluation/insertEvaluation';
import experienceDelete from './userProfile/experience/experienceDelete';
import experienceInsert from './userProfile/experience/experienceInsert';
import experienceOverview from './userProfile/experience/experienceOverview';
import deleteFamily from './userProfile/family/deleteFamily';
import getFamily from './userProfile/family/getFamily';
import insertFamily from './userProfile/family/insertFamily';
import resolutionDelete from './userProfile/resolution/deleteResolution';
import resolutionInsert from './userProfile/resolution/insertResolution';
import resolutionOverview from './userProfile/resolution/getResolutions';
import salaryParamsInsert from './userProfile/salaryParams/salarayParamsInsert';
import salaryParamsOverview from './userProfile/salaryParams/salaryParamsOverview';
import userProfileOverview from './userProfile/userProfileOverview';
import GetVacation from './userProfile/vacation/vacationGet';
import vacationInsert from './userProfile/vacation/vacationInsert';
import getResolutions from './userProfile/resolution/getResolutions';
import deleteResolution from './userProfile/resolution/deleteResolution';
import insertResolution from './userProfile/resolution/insertResolution';

export const BFF_URL = {
  local: 'http://localhost:8080',
  development: 'https://sss-erp-bff.oykos.me',
  staging: 'http://localhost:8080',
  production: 'http://localhost:8080',
};

export const GraphQL = {
  fetch: (query: string, variables?: any): Promise<any> => {
    return fetch(BFF_URL[getEnvironment()], {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query, variables}),
    })
      .then(response => response.json())
      .catch(error => console.error(error));
  },
  updateBasicInfo: updateBasicInfo,
  getBasicInfo: getBasicInfo,
  insertBasicInfo: insertBasicInfo,
  experienceOverview: experienceOverview,
  experienceInsert: experienceInsert,
  experienceDelete: experienceDelete,
  userProfileOverview: userProfileOverview,
  getJobTenderTypes: getJobTenderTypes,
  getEducation: getEducation,
  insertEducation: insertEducation,
  deleteEducation: deleteEducation,
  getFamily: getFamily,
  insertFamily: insertFamily,
  deleteFamily: deleteFamily,
  getForeignerPermits: getForeignerPermits,
  deleteForeignerPermit: deleteForeignerPermit,
  insertForeignerPermit: insertForeignerPermit,
  getSystematizations: getSystematizations,
  insertSystematization: insertSystematization,
  getSystematizationDetails: systematizationDetails,
  deleteSystematization: systematizationDelete,
  salaryParamsInsert: salaryParamsInsert,
  salaryParamsOverview: salaryParamsOverview,
  getResolutions: getResolutions,
  insertResolution: insertResolution,
  deleteResolution: deleteResolution,
  getEvaluations: getEvaluations,
  insertEvaluation: insertEvaluation,
  deleteEvaluation: deleteEvaluation,
  getRevisions: getRevisions,
  getRevisionDetails: getRevisionDetails,
  deleteRevision: deleteRevision,
  insertRevision: insertRevision,
  insertJobPositionInOrgUnit: insertJobPositionInOrgUnit,
  deleteJobPositionInOrgUnit: deleteJobPositionInOrgUnit,
  jobPositionsAvailableOrganizationUnit: jobPositionsAvailableOrganizationUnit,
  employeeInOrganizationUnitInsert: employeeInOrganizationUnitInsert,
  employeeInOrganizationUnitDelete: employeeInOrganizationUnitDelete,
  getAbsence: absentOverview,
  getAbsenceTypes: absentTypesOverview,
  insertAbsence: insertAbsence,
  deleteAbsence: absentDelete,
  getJudges: getJudges,
  deleteJudgeNorm: deleteJudgeNorm,
  insertJudgeNorm: insertJudgeNorm,
  deleteJudgeResolution: deleteJudgeResolution,
  insertJudgeResolution: insertJudgeResolution,
  getJudgeResolutions: getJudgeResolutions,
  getCurrentResolutionNumbers: getCurrentResolutionNumbers,
  getJudgeAvailability: getJudgeAvailability,
  settingsDropdownOverview: settingsDropdownOverview,
  getVacation: GetVacation,
  vacationInsert: vacationInsert,
  getRevisionPlans: getRevisionPlans,
  insertRevisionPlan: insertRevisionPlan,
  deleteRevisionPlan: deleteRevisionPlan,
  getRevisionPlanDetails: getRevisionPlanDetails,
  getRevisionTips: getRevisionTips,
  getRevisionTipDetails: getRevisionTipDetails,
  insertRevisionTip: insertRevisionTip,
  deleteRevisionTip: deleteRevisionTip,
  terminateEmployment: terminateEmployment,
  getJobPositions: getJobPositions,
  getAvailableJobPositions: getAvailableJobPositions,
  getJobPositionsInOrgUnit: getJobPositionsInOrgUnit,
  getJobTenders: getJobTenders,
  insertJobTender: insertJobTender,
  deleteJobTender: deleteJobTender,
  getJobTenderApplications: getJobTenderApplications,
  deleteJobTenderApplication: deleteJobTenderApplication,
  insertJobTenderApplication: insertJobTenderApplication,
};

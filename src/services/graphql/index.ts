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
import getSettings from './settings/getSettings';
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
import deleteExperience from './userProfile/experience/deleteExperience';
import getExperience from './userProfile/experience/getExperience';
import insertExperience from './userProfile/experience/insertExperience';
import deleteFamily from './userProfile/family/deleteFamily';
import getFamily from './userProfile/family/getFamily';
import insertFamily from './userProfile/family/insertFamily';
import userProfileOverview from './userProfile/gtUserProfiles';
import deleteResolution from './userProfile/resolution/deleteResolution';
import getResolutions from './userProfile/resolution/getResolutions';
import insertResolution from './userProfile/resolution/insertResolution';
import getSalaryParams from './userProfile/salaryParams/getSalaryParams';
import insertSalaryParams from './userProfile/salaryParams/insertSalaryParams';
import getVacations from './userProfile/vacation/getVacations';
import insertVacation from './userProfile/vacation/insertVacation';
import vacationReport from './vacationReport/vacationReport';

export const BFF_URL = {
  local: 'http://localhost:8080',
  development: 'https://sss-erp-bff.oykos.me',
  staging: 'http://localhost:8080',
  production: 'http://localhost:8080',
};

export const GraphQL = {
  updateBasicInfo: updateBasicInfo,
  getBasicInfo: getBasicInfo,
  insertBasicInfo: insertBasicInfo,
  getExperience: getExperience,
  insertExperience: insertExperience,
  deleteExperience: deleteExperience,
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
  insertSalaryParams: insertSalaryParams,
  getSalaryParams: getSalaryParams,
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
  getSettings: getSettings,
  getVacation: getVacations,
  insertVacation: insertVacation,
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
  vacationReport: vacationReport,
};

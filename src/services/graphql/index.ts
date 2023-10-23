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
import jobTenderTypesSearch from './jobTenderTypes/jobTenderTypesSearch';
import deleteJobTender from './jobTenders/deleteJobTender';
import deleteJobTenderApplication from './jobTenderApplications/deleteJobTenderApplication';
import getJobTenderApplications from './jobTenderApplications/getJobTenderApplications';
import getJobTenders from './jobTenders/getJobTenders';
import insertJobTender from './jobTenders/insertJobTender';
import insertJobTenderApplication from './jobTenderApplications/insertJobTenderApplication';
import judgeAndPresidentCheckIsAvailable from './judges/judgeAndPresidentCheckIsAvailable';
import judgeNormDelete from './judges/judgeNormDelete';
import judgeNormInsert from './judges/judgeNormInsert';
import judgeOverview from './judges/judgeOverview';
import judgeResolutionDelete from './judges/judgeResolutionDelete';
import judgeResolutionInsert from './judges/judgeResolutionInsert';
import judgeResolutionOverview from './judges/judgeResolutionOverview';
import getOrganizationUnitRealJudgeNumberData from './judges/organizationUintCalculateEmployeeStats';
import employeeInOrganizationUnitDelete from './organizationUnitsEmployees/employeeInOrganizationUnitDelete';
import employeeInOrganizationUnitInsert from './organizationUnitsEmployees/employeeInOrganizationUnitInsert';
import revisionDelete from './revision/revisionDelete';
import revisionDetails from './revision/revisionDetails';
import revisionInsert from './revision/revisionInsert';
import revisionOverview from './revision/revisionOverview';
import revisionTipsDelete from './revisionTips/revisionTipsDelete';
import revisionTipsDetails from './revisionTips/revisionTipsDetails';
import revisionTipsInsert from './revisionTips/revisionTipsInsert';
import revisionTipsOverview from './revisionTips/revisionTipsOverview';
import revisionPlanDelete from './revisionsPlans/revisionPlanDelete';
import revisionPlanDetails from './revisionsPlans/revisionPlanDetails';
import revisionPlanInsert from './revisionsPlans/revisionPlanInsert';
import revisionPlansOverview from './revisionsPlans/revisionPlanOverview';
import settingsDropdownOverview from './settingsDropdown/settingsDropdownOverview';
import getSuppliersOverview from './suppliers/getSuppliers';
import systematizationDelete from './systematization/deleteSystematization';
import systematizationDetails from './systematization/getSystematizationDetails';
import getSystematizations from './systematization/getSystematizations';
import insertSystematization from './systematization/insertSystematization';
import terminateEmployment from './terminateEmployment/terminateEmployment';
import absentDelete from './userProfile/absents/deleteAbsence';
import absentOverview from './userProfile/absents/getAbsence';
import absentTypesOverview from './userProfile/absents/getAbsenceTypes';
import insertAbsence from './userProfile/absents/insertAbsence';
import basicInfoGet from './userProfile/basicInfo/basicInfoGet';
import basicInfoInsert from './userProfile/basicInfo/basicInfoInsert';
import basicInfoUpdate from './userProfile/basicInfo/basicInfoUpdate';
import educationDelete from './userProfile/education/educationDelete';
import educationInsert from './userProfile/education/educationInsert';
import educationOverview from './userProfile/education/educationOverview';
import evaluationDelete from './userProfile/evaluation/evaluationDelete';
import evaluationInsert from './userProfile/evaluation/evaluationInsert';
import evaluationOverview from './userProfile/evaluation/evalutationOverview';
import experienceDelete from './userProfile/experience/experienceDelete';
import experienceInsert from './userProfile/experience/experienceInsert';
import experienceOverview from './userProfile/experience/experienceOverview';
import familyDelete from './userProfile/family/familyDelete';
import familyOverview from './userProfile/family/familyOverview';
import familyInsert from './userProfile/family/familyinsert';
import resolutionDelete from './userProfile/resolution/resolutionDelete';
import resolutionInsert from './userProfile/resolution/resolutionInsert';
import resolutionOverview from './userProfile/resolution/resolutionOverview';
import salaryParamsInsert from './userProfile/salaryParams/salarayParamsInsert';
import salaryParamsOverview from './userProfile/salaryParams/salaryParamsOverview';
import userProfileOverview from './userProfile/userProfileOverview';
import GetVacation from './userProfile/vacation/vacationGet';
import vacationInsert from './userProfile/vacation/vacationInsert';

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
  basicInfoUpdate: basicInfoUpdate,
  basicInfoGet: basicInfoGet,
  basicInfoInsert: basicInfoInsert,
  experienceOverview: experienceOverview,
  experienceInsert: experienceInsert,
  experienceDelete: experienceDelete,
  userProfileOverview: userProfileOverview,
  jobTenderTypesSearch: jobTenderTypesSearch,
  judgeAndPresidentCheckIsAvailable: judgeAndPresidentCheckIsAvailable,
  educationOverview: educationOverview,
  educationInsert: educationInsert,
  educationDelete: educationDelete,
  familyOverview: familyOverview,
  familyInsert: familyInsert,
  familyDelete: familyDelete,
  getForeignerPermits: getForeignerPermits,
  deleteForeignerPermit: deleteForeignerPermit,
  insertForeignerPermit: insertForeignerPermit,
  getSystematizations: getSystematizations,
  insertSystematization: insertSystematization,
  getSystematizationDetails: systematizationDetails,
  deleteSystematization: systematizationDelete,
  salaryParamsInsert: salaryParamsInsert,
  salaryParamsOverview: salaryParamsOverview,
  resolutionOverview: resolutionOverview,
  resolutionInsert: resolutionInsert,
  resolutionDelete: resolutionDelete,
  evaluationOverview: evaluationOverview,
  evaluationInsert: evaluationInsert,
  evaluationDelete: evaluationDelete,
  revisionOverview: revisionOverview,
  revisionDetails: revisionDetails,
  revisionDelete: revisionDelete,
  revisionInsert: revisionInsert,
  insertJobPositionInOrgUnit: insertJobPositionInOrgUnit,
  deleteJobPositionInOrgUnit: deleteJobPositionInOrgUnit,
  jobPositionsAvailableOrganizationUnit: jobPositionsAvailableOrganizationUnit,
  employeeInOrganizationUnitInsert: employeeInOrganizationUnitInsert,
  employeeInOrganizationUnitDelete: employeeInOrganizationUnitDelete,
  getAbsence: absentOverview,
  getAbsenceTypes: absentTypesOverview,
  insertAbsence: insertAbsence,
  deleteAbsence: absentDelete,
  judgeOverview: judgeOverview,
  judgeNormDelete: judgeNormDelete,
  judgeNormInsert: judgeNormInsert,
  judgeResolutionDelete: judgeResolutionDelete,
  judgeResolutionInsert: judgeResolutionInsert,
  judgeResolutionOverview: judgeResolutionOverview,
  getOrganizationUnitRealJudgeNumberData: getOrganizationUnitRealJudgeNumberData,
  settingsDropdownOverview: settingsDropdownOverview,
  getSuppliersOverview: getSuppliersOverview,
  getVacation: GetVacation,
  vacationInsert: vacationInsert,
  revisionPlansOverview: revisionPlansOverview,
  revisionPlanInsert: revisionPlanInsert,
  revisionPlanDelete: revisionPlanDelete,
  revisionPlanDetails: revisionPlanDetails,
  revisionTipsOverview: revisionTipsOverview,
  revisionTipsDetails: revisionTipsDetails,
  revisionTipsInsert: revisionTipsInsert,
  revisionTipsDelete: revisionTipsDelete,
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

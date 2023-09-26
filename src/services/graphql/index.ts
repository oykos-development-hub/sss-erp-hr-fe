import {getEnvironment} from '../get-environment';
import organizationUnits from './organizationUnits/organizationUnitOverview';
import foreignerPermitDelete from './foreignerPermits/foreignerPermitDelete';
import foreignerPermitInsert from './foreignerPermits/foreignerPermitInsert';
import foreignerPermits from './foreignerPermits/foreignerPermitOverview';
import jobPositionsGet from './jobPositions/jobPositionOverview';
import jobPositionInOrganizationUnitInsert from './organizationUnitsJobPositions/jobPositionInOrganizationUnitInsert';
import employeeInOrganizationUnitInsert from './organizationUnitsEmployees/employeeInOrganizationUnitInsert';
import employeeInOrganizationUnitDelete from './organizationUnitsEmployees/employeeInOrganizationUnitDelete';
import jobPositionInOrganizationUnitDelete from './organizationUnitsJobPositions/jobPositionInOrganizationUnitDelete';
import basicInfoGet from './userProfile/basicInfo/basicInfoGet';
import basicInfoInsert from './userProfile/basicInfo/basicInfoInsert';
import experienceOverview from './userProfile/experience/experienceOverview';
import experienceInsert from './userProfile/experience/experienceInsert';
import experienceDelete from './userProfile/experience/experienceDelete';
import educationOverview from './userProfile/education/educationOverview';
import educationDelete from './userProfile/education/educationDelete';
import educationInsert from './userProfile/education/educationInsert';
import familyInsert from './userProfile/family/familyinsert';
import familyOverview from './userProfile/family/familyOverview';
import familyDelete from './userProfile/family/familyDelete';
import salaryParamsInsert from './userProfile/salaryParams/salarayParamsInsert';
import salaryParamsOverview from './userProfile/salaryParams/salaryParamsOverview';
import evaluationDelete from './userProfile/evaluation/evaluationDelete';
import evaluationInsert from './userProfile/evaluation/evaluationInsert';
import evaluationOverview from './userProfile/evaluation/evalutationOverview';
import resolutionDelete from './userProfile/resolution/resolutionDelete';
import resolutionInsert from './userProfile/resolution/resolutionInsert';
import resolutionOverview from './userProfile/resolution/resolutionOverview';
import absentDelete from './userProfile/absents/deleteAbsence';
import absentInsert from './userProfile/absents/insertAbsence';
import absentOverview from './userProfile/absents/getAbsence';
import judgeOverview from './judges/judgeOverview';
import judgeNormDelete from './judges/judgeNormDelete';
import judgeNormInsert from './judges/judgeNormInsert';
import judgeResolutionDelete from './judges/judgeResolutionDelete';
import judgeResolutionInsert from './judges/judgeResolutionInsert';
import judgeResolutionOverview from './judges/judgeResolutionOverview';
import organizationUnitInsert from './organizationUnits/organizationUnitInsert';
import organizationUnitDelete from './organizationUnits/organizationUnitDelete';
import jobTenderApplicationDelete from './jobTenders/jobTenderApplicationDelete';
import jobTenderInsert from './jobTenders/jobTenderInsert';
import jobPositionSearch from './jobPositions/jobPositionsSearch';
import jobTenderTypesSearch from './jobTenderTypes/jobTenderTypesSearch';
import revisionDelete from './internalRevision/revisionDelete';
import revisionDetails from './internalRevision/revisionDetails';
import revisionInsert from './internalRevision/revisionInsert';
import revisionOverview from './internalRevision/revisionOverview';
import jobTenderDelete from './jobTenders/jobTenderDelete';
import jobTenderOverview from './jobTenders/jobTenderOverview';
import jobTenderApplicationOverview from './jobTenders/jobTenderApplicationOverview';
import jobTenderApplicationInsert from './jobTenders/jobTenderApplicationInsert';
import systematizationDetails from './systematization/systematizationDetails';
import systematizationOverview from './systematization/systematizationOverview';
import systematizationInsert from './systematization/systematizationsInsert';
import systematizationDelete from './systematization/systematizationsDelete';
import userProfileOverview from './userProfile/userProfileOverview';
import jobPositionsOrganizationUnit from './jobPositions/jobPositionsOrganizationUnit';
import absentTypesOverview from './userProfile/absents/getAbsenceTypes';
import settingsDropdownOverview from './settingsDropdown/settingsDropdownOverview';
import basicInfoUpdate from './userProfile/basicInfo/basicInfoUpdate';
import jobPositionsAvailableOrganizationUnit from './jobPositions/jobPositionsAvailableOrganizationUnit';
import getSuppliersOverview from './suppliers/getSuppliers';
import organizationUintCalculateEmployeeStats from './judges/organizationUintCalculateEmployeeStats';
import vacationInsert from './userProfile/vacation/vacationInsert';
import GetVacation from './userProfile/vacation/vacationGet';
<<<<<<< HEAD
import insertAbsence from './userProfile/absents/insertAbsence';
=======
import judgeAndPresidentCheckIsAvailable from './judges/judgeAndPresidentCheckIsAvailable';
>>>>>>> d196da8339cb6155c3da0e999cedf535de4ad504

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
  organizationUnits: organizationUnits,
  basicInfoUpdate: basicInfoUpdate,
  basicInfoGet: basicInfoGet,
  basicInfoInsert: basicInfoInsert,
  experienceOverview: experienceOverview,
  experienceInsert: experienceInsert,
  experienceDelete: experienceDelete,
  userProfileOverview: userProfileOverview,
  jobTenderOverview: jobTenderOverview,
  jobTenderDelete: jobTenderDelete,
  jobTenderApplicationDelete: jobTenderApplicationDelete,
  jobTenderInsert: jobTenderInsert,
  jobPositionSearch: jobPositionSearch,
  jobTenderTypesSearch: jobTenderTypesSearch,
  jobTenderApplicationOverview: jobTenderApplicationOverview,
  jobTenderApplicationInsert: jobTenderApplicationInsert,
  judgeAndPresidentCheckIsAvailable: judgeAndPresidentCheckIsAvailable,
  foreignerPermits: foreignerPermits,
  educationOverview: educationOverview,
  educationInsert: educationInsert,
  educationDelete: educationDelete,
  familyOverview: familyOverview,
  familyInsert: familyInsert,
  familyDelete: familyDelete,
  foreignerPermitDelete: foreignerPermitDelete,
  foreignerPermitInsert: foreignerPermitInsert,
  systematizationOverview: systematizationOverview,
  systematizationInsert: systematizationInsert,
  systematizationDetails: systematizationDetails,
  systematizationDelete: systematizationDelete,
  salaryParamsInsert: salaryParamsInsert,
  salaryParamsOverview: salaryParamsOverview,
  jobPositionsGet: jobPositionsGet,
  jobPositionsOrganizationUnit: jobPositionsOrganizationUnit,
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
  organizationUnitInsert: organizationUnitInsert,
  organizationUnitDelete: organizationUnitDelete,
  jobPositionInOrganizationUnitInsert: jobPositionInOrganizationUnitInsert,
  jobPositionInOrganizationUnitDelete: jobPositionInOrganizationUnitDelete,
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
  organizationUintCalculateEmployeeStats: organizationUintCalculateEmployeeStats,
  settingsDropdownOverview: settingsDropdownOverview,
  getSuppliersOverview: getSuppliersOverview,
  getVacation: GetVacation,
  vacationInsert: vacationInsert,
};

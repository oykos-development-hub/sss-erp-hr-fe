import {GetResponse} from './response';

export type VacationReportParams = {
  employee_id: number | null;
  organization_unit_id: number;
  type: any;
};

export type VacationReportResponse = {vacation_Report: GetResponse<VacationReportParams>};

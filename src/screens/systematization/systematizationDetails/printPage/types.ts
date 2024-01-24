export interface SystematizationDocumentProps {
  date: string;
  organizationUnit: string;
  tableData: TableData[];
}

export interface SystematizationTableRowProps {
  serialNumber: string;
  jobTitle: string;
  jobRequirements: string;
  jobDescription: string;
  numberOfEmployees: string;
}

export interface JobPositionOrgUnitTableData {
  available_slots: number;
  description: string;
  requirements: string;
  job_title: string;
}
export interface TableData {
  title: string;
  id: number;
  job_positions_organization_units: JobPositionOrgUnitTableData[];
}

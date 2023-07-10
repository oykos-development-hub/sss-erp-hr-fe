export interface EmployeeTableData {
  id: string;
  fullName: string;
  dateOfBirth: string;
  department: string;
  judge: string;
  position: string;
  status: {label: string; status: boolean};
}

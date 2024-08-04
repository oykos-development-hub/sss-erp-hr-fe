export const reportsTabs = [
  {id: 1, title: 'Izvještaji', routeName: 'reports-tab', disabled: false},
  {id: 2, title: 'Šabloni', routeName: 'patterns-tab', disabled: false},
  {id: 3, title: 'Parametri', routeName: 'parameters-tab', disabled: false},
];

export const reportTypeOptions = [
  {id: 0, title: 'Iskorišteni dani godišnjeg odmora za zaposlene'},
  {id: 1, title: 'Izvještaj o broju sudija'},
  {id: 2, title: 'Izvještaj o ocjenjivanju sudija'},
  {id: 3, title: 'Izvještaj o slobodnim sudijskim mjestima'},
  {id: 4, title: 'Izvještaj o starosnoj strukturi sudija'},
  {id: 5, title: 'Potvrda o stalnom radnom odnosu'},
];

export enum HrReportType {
  UsedVacationDays = 0,
  NumberOfJudges = 1,
  EvaluationsForJudges = 2,
  VacantJudgePositions = 3,
  AgeStructureOfJudges = 4,
  CertificateOfPermanentEmployment = 5,
}

export type TemplatesModalProps = {
  open: boolean;
  alert: any;
  onClose: (action?: any) => void;
  userProfileId?: number;
  key?: string;
};

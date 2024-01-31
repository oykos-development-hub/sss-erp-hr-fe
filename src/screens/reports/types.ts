export const reportsTabs = [
  {id: 1, title: 'Izvještaji', routeName: 'reports-tab', disabled: false},
  {id: 2, title: 'Šabloni', routeName: 'patterns-tab', disabled: false},
];

export const reportTypeOptions = [
  {id: 0, title: 'Iskorišteni dani godišnjeg odmora za zaposlene'},
  {id: 1, title: 'Izvještaj o broju sudija'},
  {id: 2, title: 'Izvještaj o ocjenjivanju sudija'},
  {id: 3, title: 'Izvještaj o slobodnim sudijskim mjestima'},
];

export enum HrReportType {
  UsedVacationDays = 0,
  NumberOfJudges = 1,
  EvaluationsForJudges = 2,
  VacantJudgePositions = 3,
}

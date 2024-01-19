import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {VacationReportParams, VacationReportResponse} from '../../../types/graphql/vacationReport';

const useVacationReport = () => {
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchVactionReport = async ({employee_id, organization_unit_id, type}: VacationReportParams) => {
    const response: VacationReportResponse = await fetch(GraphQL.vacationReport, {
      employee_id,
      organization_unit_id,
      type,
    });

    const vacationReport = response?.vacation_Report;

    setLoading(false);
    return vacationReport;
  };
  return {loading, fetch: fetchVactionReport};
};

export default useVacationReport;

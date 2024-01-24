import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  JudgeEvaluationReportParams,
  JudgeEvaluationReportResponse,
} from '../../../types/graphql/judgeEvaluationReport.ypes';

const useJudgeEvaluationReport = () => {
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchJudgeEvaluationReport = async ({
    reason_for_evaluation,
    organization_unit_id,
    score,
  }: JudgeEvaluationReportParams) => {
    const response: JudgeEvaluationReportResponse = await fetch(GraphQL.judgeEvaluationReport, {
      reason_for_evaluation,
      organization_unit_id,
      score,
    });

    const judgeEvaluationReport = response?.judgeEvaluation_Report;

    setLoading(false);
    return judgeEvaluationReport;
  };
  return {loading, fetchJudgeEvaluationReport};
};

export default useJudgeEvaluationReport;

import {GetResponse} from './response';

export type JudgeEvaluationReportParams = {
  reason_for_evaluation: string | null;
  organization_unit_id: number | null;
  score: string | null;
};

export type JudgeEvaluationReportResponse = {judgeEvaluation_Report: GetResponse<JudgeEvaluationReportParams>};

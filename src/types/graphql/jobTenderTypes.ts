import {GetResponse} from './response';

export interface JobTenderType {
  id: number;
  title: string;
  abbreviation: string;
  description: string;
  value: string;
  is_judge: boolean;
  is_judge_president: boolean;
  color: string;
  icon: string;
}

export interface JobTenderTypeResponse {
  jobTenderTypes: GetResponse<JobTenderType>;
}

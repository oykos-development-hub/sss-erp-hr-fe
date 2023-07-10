export interface JobPosition {
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

export interface JobPositionResponse {
  items: JobPosition[];
  message: string;
  status: string;
  total: number;
}

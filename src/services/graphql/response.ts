export interface OverviewResponse<T> {
  status: string;
  message: string;
  items: T[];
  total?: number;
}

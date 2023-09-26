export type GetResponse<T> = {
  status: string;
  message: string;
  total?: number;
  items: T[];
};

export type InsertResponse<T> = {
  status: string;
  message: string;
  item: T;
};

export type DeleteResponse = {
  status: string;
  message: string;
};

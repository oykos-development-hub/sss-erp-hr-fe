import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface Supplier {
  id: number;
  title: string;
  abbreviation: string;
  official_id: string;
  address: string;
  description: string;
  folder_id: number;
}

export interface SupplierFormValues extends Omit<Supplier, 'id'> {
  id: number | null;
}

export type SuppliersResponse = {
  get: {
    suppliers_Overview: GetResponse<Supplier>;
  };
  insert: {
    suppliers_Insert: InsertResponse<Supplier>;
  };
  delete: {
    suppliers_Delete: DeleteResponse;
  };
};

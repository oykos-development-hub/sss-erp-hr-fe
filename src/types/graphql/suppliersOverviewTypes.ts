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

export interface SuppliersOverviewResponse {
  data: {
    suppliers_Overview: {
      status?: string;
      message?: string;
      total?: number;
      items?: Supplier[];
    };
  };
}

export interface SuppliersOverviewInsertResponse {
  data: {
    suppliers_Insert: {
      status?: string;
      message?: string;
      items?: Supplier;
    };
  };
}

export interface SuppliersOverviewDeleteResponse {
  data: {
    suppliers_Delete: {
      status?: string;
      message?: string;
    };
  };
}

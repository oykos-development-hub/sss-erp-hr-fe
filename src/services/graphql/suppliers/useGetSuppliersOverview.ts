import {useEffect, useState} from 'react';
import { GraphQL } from '..';
import { Supplier } from '../../../types/graphql/suppliersOverviewTypes';

const useSuppliersOverview = (id?: number, search?: string) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    const response = await GraphQL.getSuppliersOverview(id, search);
    const suppliers = response?.items;
    setSuppliers(suppliers as Supplier[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [id, search]);

  return {suppliers: suppliers, loading, fetch: fetchSuppliers};
};

export default useSuppliersOverview;

import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {Supplier, SuppliersResponse} from '../../../types/graphql/suppliersOverviewTypes';
import {REQUEST_STATUSES} from '../../constants';

const useGetSuppliers = (id?: number, search?: string) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch, graphQl} = useAppContext();

  const fetchSuppliers = async () => {
    setLoading(true);

    const response: SuppliersResponse['get'] = await fetch(graphQl.getSuppliersOverview, {id, search});

    if (response.suppliers_Overview?.status === REQUEST_STATUSES.success) {
      setSuppliers(response.suppliers_Overview.items);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [id, search]);

  return {suppliers, loading, fetch: fetchSuppliers};
};

export default useGetSuppliers;

import {useEffect, useState} from 'react';
import {GraphQL} from '../..';

const useSalaryParamsOverview = (id: number) => {
  const [salaryParams, setSalaryParams] = useState<any>();
  const [loading, setLoading] = useState(true);

  const fetchSalaryParams = async () => {
    const response = await GraphQL.salaryParamsOverview(id);

    if (response) {
      setSalaryParams(response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryParams();
  }, [id]);

  return {data: salaryParams, loading, refetch: fetchSalaryParams};
};

export default useSalaryParamsOverview;

import {useEffect, useMemo, useState} from 'react';
import {GraphQL} from '..';
import {JobTenderTypeResponse} from '../../../types/graphql/useJobTendersTypes';

const initialState = {items: [], total: 0, message: '', status: ''};

const useJobTendersTypesSearch = (search: string) => {
  const [types, setData] = useState<JobTenderTypeResponse>(initialState);
  const [loading, setLoading] = useState(true);
  const typesUnitsList = useMemo(() => {
    return [
      {id: 0, title: 'Svi tipovi oglasa'},
      ...types.items.map(unit => {
        return {id: unit.id, title: unit.title};
      }),
    ];
  }, [types]);

  const fetchJobTenderTypes = async () => {
    const jobTenderTypes: any = await GraphQL.jobTenderTypesSearch(search);
    setData(jobTenderTypes);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobTenderTypes();
  }, [search]);

  return {types, typesUnitsList, loading};
};

export default useJobTendersTypesSearch;

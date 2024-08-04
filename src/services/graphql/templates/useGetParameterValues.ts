import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GraphQL} from '..';
import {ParameterValuesResponse} from '../../../types/graphql/parameters.ts';

const useGetParameterValues = (userProfileId: number) => {
  const [parameterValues, setParameterValues] = useState<[string: string][]>();
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const addKebabCaseKeys = (snakeCasedKeys: [string: string][]): [string: string][] => {
    const newObject = {...snakeCasedKeys};

    Object.entries(snakeCasedKeys).forEach(([key, value]) => {
      const kebabCaseKey: any = key.replace(/_/g, '-');
      newObject[kebabCaseKey] = value;
    });

    return newObject;
  };

  const fetchParameterValues = async () => {
    setLoading(true);
    const response: ParameterValuesResponse['get'] = await fetch(GraphQL.getParameterValues, {id: userProfileId});

    if (response?.dataForTemplate_Overview?.item) {
      const data: any = response.dataForTemplate_Overview.item;

      data['danasnji-datum'] = data['tekuci_datum'];

      setParameterValues(addKebabCaseKeys(data));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchParameterValues();
  }, [userProfileId]);

  return {
    parameterValues,
    refetch: fetchParameterValues,
    loading,
  };
};

export default useGetParameterValues;

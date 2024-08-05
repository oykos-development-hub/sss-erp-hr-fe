import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GraphQL} from '..';
import {ParameterValuesResponse} from '../../../types/graphql/parameters.ts';
import {calculateBusinessDays, transformDate} from '../../../utils/dateUtils.ts';

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

      data['danasnji_datum'] = data['tekuci_datum'];
      data['trajanje_godisnjeg_odmora'] = calculateBusinessDays(
        transformDate(data['datum_pocetka_godisnjeg_odmora']),
        transformDate(data['datum_kraja_godisnjeg_odmora']),
      );

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

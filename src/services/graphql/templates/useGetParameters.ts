import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {Parameter, ParameterResponse} from '../../../types/graphql/parameters.ts';

const useGetParameters = () => {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const fetchParameters = async () => {
    setLoading(true);

    const response: ParameterResponse['get'] = await fetch(GraphQL.getParameters);

    if (response.listOfParameters_Overview.status === 'success') {
      setParameters(
        response.listOfParameters_Overview?.items?.sort((a: Parameter, b: Parameter) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          }
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          }
          return 0;
        }),
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  return {parameters, loading, refetch: fetchParameters};
};

export default useGetParameters;

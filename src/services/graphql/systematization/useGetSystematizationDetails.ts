import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  SystematizationDetails,
  SystematizationType,
  SystematizationsResponse,
} from '../../../types/graphql/systematizationsTypes';

const useGetSystematizationDetails = (id: number) => {
  const [systematizationDetails, setSystematizationDetails] = useState<SystematizationDetails>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const getSystematizationDetails = async (onSuccess?: (item: SystematizationType) => void) => {
    setLoading(true);

    const response: SystematizationsResponse['details'] = await fetch(GraphQL.getSystematizationDetails, {id});

    if (response.systematization_Details) {
      setSystematizationDetails(response.systematization_Details.item);
      onSuccess && onSuccess(response.systematization_Details.item);
    }

    setLoading(false);
  };

  useEffect(() => {
    getSystematizationDetails();
  }, [id]);

  return {systematizationDetails, loading, refetch: getSystematizationDetails};
};

export default useGetSystematizationDetails;

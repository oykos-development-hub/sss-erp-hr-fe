import {useState} from 'react';
import {GraphQL} from '..';

const useOrganizationUnitJobPositionDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteJobPositionInOrganizationUnit = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.jobPositionInOrganizationUnitDelete(id);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteJobPositionInOrganizationUnit};
};

export default useOrganizationUnitJobPositionDelete;

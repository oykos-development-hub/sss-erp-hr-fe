import {useState} from 'react';
import {GraphQL} from '..';

const useEmployeeInOrganizationUnitDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteEmployeeInOrganizationUnit = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.employeeInOrganizationUnitDelete(id);
    if (response.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteEmployeeInOrganizationUnit};
};

export default useEmployeeInOrganizationUnitDelete;

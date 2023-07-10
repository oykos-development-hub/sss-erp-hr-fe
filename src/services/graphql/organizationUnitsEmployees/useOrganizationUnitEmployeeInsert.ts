import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {EmployeeInOrganizationUnitInsert} from '../../../types/graphql/employeeInOrganizationUnitTypes';

const useOrganizationUnitEmployeeInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertEmployee = async (
    data: EmployeeInOrganizationUnitInsert,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.employeeInOrganizationUnitInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else if (response.status === REQUEST_STATUSES.error) {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertEmployee};
};

export default useOrganizationUnitEmployeeInsert;

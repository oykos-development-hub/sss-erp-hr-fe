import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {UserProfileResponse} from '../../../types/graphql/userProfiles';
import {EmployeeListFilters} from '../../../screens/employees';
import {PaginationProps} from '../../../types/paginationParams';

const initialState = {items: [], total: 0, message: '', status: ''};

interface UserProfileHookParams extends EmployeeListFilters, PaginationProps {
  id?: null;
  name?: string;
}

const useUserProfiles = ({
  page,
  size,
  id,
  is_active,
  job_position_id,
  organization_unit_id,
  name,
}: UserProfileHookParams) => {
  const [data, setData] = useState<UserProfileResponse>(initialState);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    const userProfiles: any = await GraphQL.userProfileOverview({
      page,
      size,
      id: id ?? null,
      is_active: is_active ? is_active.id : true,
      job_position_id: job_position_id ? job_position_id.id : null,
      organization_unit_id: organization_unit_id ? organization_unit_id.id : null,
      name: name ?? '',
    });
    setData(userProfiles);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, size, id, is_active, job_position_id, organization_unit_id, name]);

  return {data, loading, refetch: fetchEmployees};
};

export default useUserProfiles;

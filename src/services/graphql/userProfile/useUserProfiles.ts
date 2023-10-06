import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {UserProfile, UserProfileOverviewParams, UserProfileResponse} from '../../../types/graphql/userProfiles';

const useUserProfiles = ({
  page,
  size,
  id,
  is_active,
  job_position_id,
  organization_unit_id,
  type,
  name,
}: UserProfileOverviewParams) => {
  const [userProfiles, setUserProfile] = useState<UserProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchEmployees = async () => {
    setLoading(true);

    const response: UserProfileResponse = await fetch(GraphQL.userProfileOverview, {
      page,
      size,
      id: id ?? null,
      is_active: is_active ? is_active.id : true,
      job_position_id: job_position_id ? job_position_id.id : null,
      organization_unit_id: organization_unit_id ? organization_unit_id.id : null,
      name: name ?? '',
    });

    if (response.userProfiles_Overview?.items) {
      setUserProfile(response.userProfiles_Overview.items);
      setTotal(response.userProfiles_Overview.total);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, size, id, is_active, job_position_id, organization_unit_id, type, name]);

  return {userProfiles, total, loading, refetch: fetchEmployees};
};

export default useUserProfiles;

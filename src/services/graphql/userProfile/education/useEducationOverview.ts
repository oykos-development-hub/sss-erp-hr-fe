import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {UserProfileEducation} from '../../../../types/graphql/userProfileGetEducation';

const useEducationOverview = (id: number, education_type: string) => {
  const [employeeEducationData, setEmployeeEducationDataInfo] = useState<UserProfileEducation[]>();
  const [loading, setLoading] = useState(true);

  const fetchEmployeeEducation = async () => {
    const response = await GraphQL.educationOverview(id, education_type);
    const education = response.items;
    setEmployeeEducationDataInfo(education);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployeeEducation();
  }, [id]);

  return {employeeEducationData: employeeEducationData, loading, refetchData: fetchEmployeeEducation};
};

export default useEducationOverview;

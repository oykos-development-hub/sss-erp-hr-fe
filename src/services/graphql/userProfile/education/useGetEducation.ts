import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {ProfileEducation, ProfileEducationResponse} from '../../../../types/graphql/education';
import {REQUEST_STATUSES} from '../../../constants';

const usGetEducation = (id: number, education_type: string) => {
  const [educationData, setEducationData] = useState<ProfileEducation[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchProfileEducation = async () => {
    setLoading(true);

    const response: ProfileEducationResponse['get'] = await fetch(GraphQL.getEducation, {
      user_profile_id: id,
      education_type,
    });

    if (response.userProfile_Education?.status === REQUEST_STATUSES.success) {
      setEducationData(response.userProfile_Education.items ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfileEducation();
  }, [id]);

  return {educationData, loading, refetch: fetchProfileEducation};
};

export default usGetEducation;

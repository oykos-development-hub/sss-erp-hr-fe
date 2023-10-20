import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {Absence, AbsenceSummary, AbsentResponse} from '../../../../types/graphql/absents';

const useGetAbsence = (user_profile_id: number) => {
  const [absence, setAbsence] = useState<Absence[]>();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AbsenceSummary>();

  const {fetch} = useAppContext();

  const fetchAbsence = async () => {
    const response: AbsentResponse['get'] = await fetch(GraphQL.getAbsence, {user_profile_id});

    const absents = response?.userProfile_Absent.items;
    const summary = response?.userProfile_Absent.summary;

    if (absents) setAbsence(absents);
    if (summary) setSummary(summary);

    setLoading(false);
  };

  useEffect(() => {
    fetchAbsence();
  }, [user_profile_id]);

  return {absence, summary, loading, refetch: fetchAbsence};
};

export default useGetAbsence;

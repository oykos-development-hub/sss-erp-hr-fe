import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {AbsenceType, AbsenceTypeResponse} from '../../../../types/graphql/absents';

const useGetAbsenceTypes = (page?: number, size?: number) => {
  const [absenceTypes, setAbsenceType] = useState<AbsenceType[]>();
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchAbsenceTypes = async () => {
    setLoading(true);

    const response: AbsenceTypeResponse = await fetch(GraphQL.getAbsenceTypes, {page, size});
    const absents = response?.absentType.items;

    setAbsenceType(absents);
    setLoading(false);
  };

  useEffect(() => {
    fetchAbsenceTypes();
  }, []);

  return {absenceTypes, loading, refetchData: fetchAbsenceTypes};
};

export default useGetAbsenceTypes;

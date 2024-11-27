import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {RevisionTipImplementation, RevisionTipImplementationsParams, RevisionTipImplementationsResponse, RevisionTipsGetParams, RevisionTipsResponse} from '../../../types/graphql/revisionTips';
import useAppContext from '../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../constants';
import {DropdownDataNumber} from '../../../types/dropdownData';

type RevisionTipImplementationState = {
  items?: RevisionTipImplementation[];
  revisors: DropdownDataNumber[];
};

const initialData: RevisionTipImplementationState = {
  items: [],
  revisors: [],
};

const useGetRevisionTipImplementations = ({tip_id, id}: RevisionTipImplementationsParams) => {
  const [revisionTipImplementation, setRevisionTipImplementation] = useState<RevisionTipImplementationState>(initialData);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionTipImplementations = async () => {
    setLoading(true);

    const response: RevisionTipImplementationsResponse['get'] = await fetch(GraphQL.getRevisionTipsImplementations, {tip_id, id});

    if (response.revisionTipImplementations_Overview?.status === REQUEST_STATUSES.success) {
      setRevisionTipImplementation({
        items: response.revisionTipImplementations_Overview.items ?? [],
        revisors: response.revisionTipImplementations_Overview.revisors ?? [],
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionTipImplementations();
  }, [tip_id]);

  return {revisionTipImplementation, loading, refetch: fetchRevisionTipImplementations};
};

export default useGetRevisionTipImplementations;

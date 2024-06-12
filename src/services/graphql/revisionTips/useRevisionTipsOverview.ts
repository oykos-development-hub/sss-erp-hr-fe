import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {RevisionTip, RevisionTipsGetParams, RevisionTipsResponse} from '../../../types/graphql/revisionTips';
import useAppContext from '../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../constants';
import {DropdownDataNumber} from '../../../types/dropdownData';

type RevisionTipsState = {
  items: RevisionTip[];
  revisors: DropdownDataNumber[];
};

const initialData: RevisionTipsState = {
  items: [],
  revisors: [],
};

const useGetRevisionTips = ({page, size, revision_id}: RevisionTipsGetParams) => {
  const [revisionTips, setRevisionTips] = useState<RevisionTipsState>(initialData);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionTips = async () => {
    setLoading(true);

    const response: RevisionTipsResponse['get'] = await fetch(GraphQL.getRevisionTips, {revision_id, page, size});

    if (response.revisionTips_Overview?.status === REQUEST_STATUSES.success) {
      setRevisionTips({
        items: response.revisionTips_Overview.items ?? [],
        revisors: response.revisionTips_Overview.revisors ?? [],
      });

      setTotal(response.revisionTips_Overview.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionTips();
  }, [page, size]);

  return {revisionTips, total, loading, refetch: fetchRevisionTips};
};

export default useGetRevisionTips;

import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {Revision, RevisionGetParams, RevisionResponse} from '../../../types/graphql/revisions';
import {REQUEST_STATUSES} from '../../constants';
import {DropdownDataNumber} from '../../../types/dropdownData';

type RevisionsState = {items: Revision[]; revisors: DropdownDataNumber[]};

const initialData: RevisionsState = {
  items: [],
  revisors: [],
};

const useGetRevisions = ({
  page,
  size,
  plan_id,
  internal_revision_subject_id,
  revision_type_id,
  revisor_id,
}: RevisionGetParams) => {
  const [revisions, setRevisions] = useState<RevisionsState>(initialData);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisions = async () => {
    setLoading(true);

    const response: RevisionResponse['get'] = await fetch(GraphQL.getRevisions, {
      plan_id,
      internal_revision_subject_id,
      revision_type_id,
      revisor_id,
    });

    if (response.revision_Overview?.status === REQUEST_STATUSES.success) {
      setRevisions({
        items: response.revision_Overview.items ?? [],
        revisors: response.revision_Overview.revisors ?? [],
      });
      setTotal(response.revision_Overview?.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRevisions();
  }, [page, size, plan_id, internal_revision_subject_id, revision_type_id, revisor_id]);

  return {revisions, total, loading, refetch: fetchRevisions};
};

export default useGetRevisions;

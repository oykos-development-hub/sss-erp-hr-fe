import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {Revision, RevisionResponse} from '../../../types/graphql/revisions';
import {REQUEST_STATUSES} from '../../constants';

const initialValues = {
  id: 0,
  title: '',
  plan_id: 0,
  serial_number: '',
  date_of_revision: '',
  revision_priority: '',
  revision_quartal: '',
  internal_revision_subject: [],
  external_revision_subject: null,
  revisor: [],
  revision_type: null,
  file: {id: 0, name: '', type: ''},
  year: '',
};

const useGetRevisionDetails = (id: number) => {
  const [revisionDetails, setRevisionDetails] = useState<Revision>(initialValues);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchRevisionDetails = async () => {
    setLoading(true);

    const response: RevisionResponse['details'] = await fetch(GraphQL.getRevisionDetails, {id});

    if (response.revision_Details?.status === REQUEST_STATUSES.success) {
      setRevisionDetails(response.revision_Details.item);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchRevisionDetails();
    }
  }, [id]);

  return {revisionDetails, loading, refetch: fetchRevisionDetails};
};

export default useGetRevisionDetails;

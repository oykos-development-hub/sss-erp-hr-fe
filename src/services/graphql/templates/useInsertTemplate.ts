import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {TemplateResponse} from '../../../types/graphql/templates.ts';
import {GraphQL} from '../index.ts';

const useInsertTemplate = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const insertTemplate = async (
    data: {title: string; file_id: number},
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: TemplateResponse['insert'] = await fetch(GraphQL.insertTemplate, {data});

    if (response?.template_Insert.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };
  return {loading, insertTemplate};
};

export default useInsertTemplate;

import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {TemplateResponse} from '../../../types/graphql/templates.ts';
import {GraphQL} from '../index.ts';

const useUpdateTemplateAdmin = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const updateTemplateAdmin = async (
    data: {title: string; id: number},
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: TemplateResponse['update'] = await fetch(GraphQL.updateTemplateAdmin, {data});

    if (response?.template_Update.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };
  return {loading, updateTemplateAdmin};
};

export default useUpdateTemplateAdmin;

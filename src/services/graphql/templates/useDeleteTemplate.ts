import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {TemplateResponse} from '../../../types/graphql/templates.ts';
import {GraphQL} from '../index.ts';

const useDeleteTemplate = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const deleteTemplate = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;

    setLoading(true);

    const response: TemplateResponse['delete'] = await fetch(GraphQL.deleteTemplate, {id});

    if (response?.template_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };
  return {loading, deleteTemplate};
};

export default useDeleteTemplate;

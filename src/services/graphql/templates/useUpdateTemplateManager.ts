import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {TemplateResponse} from '../../../types/graphql/templates.ts';
import {GraphQL} from '../index.ts';

const useUpdateTemplateManager = () => {
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const updateTemplateManager = async (
    data: {
      id: number;
      file_id: number;
      organization_unit_id: number;
      template_id: number;
    },
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;

    setLoading(true);

    const response: TemplateResponse['updateItem'] = await fetch(GraphQL.updateTemplateManager, {data});

    if (response?.templateItem_Update.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };
  return {loading, updateTemplateManager};
};

export default useUpdateTemplateManager;

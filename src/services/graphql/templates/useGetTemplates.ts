import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {Template, TemplateResponse} from '../../../types/graphql/templates.ts';

const useGetTemplates = (data?: any) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const {fetch} = useAppContext();

  const fetchTemplates = async () => {
    setLoading(true);
    const response: TemplateResponse['get'] = await fetch(GraphQL.getTemplates, data);
    if (response.template_Overview.status === 'success') {
      setTemplates(response.template_Overview.items);
      setTotal(response.template_Overview.total ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [data?.page ?? 1, data?.size ?? 1000]);

  return {templates, loading, total, refetch: fetchTemplates};
};

export default useGetTemplates;

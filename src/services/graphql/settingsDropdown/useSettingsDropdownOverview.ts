import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {SettingsDropdown} from '../../../types/graphql/settingsDropdownType';

const useSettingsDropdownOverview = (entity?: string, page?: number, size?: number, id?: number) => {
  const [data, setData] = useState<SettingsDropdown[]>();
  const [loading, setLoading] = useState(true);

  const getSettingsDropdownOverview = async (onSuccess?: (item: any) => void) => {
    const response = await GraphQL.settingsDropdownOverview({entity: entity, page: page, size: size, id: id});
    //Ask filip if we need array of items here
    const data = response?.items || null;

    setData(data || []);
    setLoading(false);
    onSuccess && onSuccess(data);
  };

  useEffect(() => {
    getSettingsDropdownOverview();
  }, [id]);

  return {data: data, loading, refetch: getSettingsDropdownOverview};
};

export default useSettingsDropdownOverview;

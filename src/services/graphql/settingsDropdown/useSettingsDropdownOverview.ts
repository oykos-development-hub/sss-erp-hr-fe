import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {SettingsDropdown, SettingsDropdownOverviewParams} from '../../../types/graphql/settingsDropdownType';
import {DropdownDataNumber} from '../../../types/dropdownData';

const useSettingsDropdownOverview = ({entity, page, size, id}: SettingsDropdownOverviewParams) => {
  const [data, setData] = useState<SettingsDropdown[]>([]);
  const [options, setOptions] = useState<DropdownDataNumber[]>([]);
  const [loading, setLoading] = useState(true);

  const getSettingsDropdownOverview = async () => {
    const response = await GraphQL.settingsDropdownOverview({entity: entity, page: page, size: size, id: id});
    //Ask filip if we need array of items here
    const data = response?.items || null;

    setData(data || []);
    setOptions(data?.map((item: any) => ({title: item.title, id: item.id})) || []);
    setLoading(false);
  };

  useEffect(() => {
    getSettingsDropdownOverview();
  }, [entity, id, page, size]);

  return {data: data, loading, refetch: getSettingsDropdownOverview, options};
};

export default useSettingsDropdownOverview;

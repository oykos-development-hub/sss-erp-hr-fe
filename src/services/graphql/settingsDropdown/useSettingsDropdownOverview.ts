import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import {SettingsDropdown, SettingsDropdownOverviewParams} from '../../../types/graphql/settingsDropdownType';
import {DropdownDataNumber} from '../../../types/dropdownData';
import useAppContext from '../../../context/useAppContext';

const useSettingsDropdownOverview = ({entity, page, size, id}: SettingsDropdownOverviewParams) => {
  const [data, setData] = useState<SettingsDropdown[]>([]);
  const [options, setOptions] = useState<DropdownDataNumber[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch, graphQl} = useAppContext();

  const getSettingsDropdownOverview = async () => {
    const response = await fetch(graphQl.getSettings, {entity: entity, page: page, size: size, id: id});

    const data = response?.settingsDropdown_Overview.items || null;

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

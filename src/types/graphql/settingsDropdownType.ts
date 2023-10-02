export type SettingsDropdownParams = {
  page?: number;
  size?: number;
  id?: number;
  entity?: string;
};

export type SettingsDropdownResponse = {
  data: {
    settingsDropdown_Overview: {
      status?: string;
      message?: string;
      total?: number;
      items: SettingsDropdown[];
    };
  };
};

export type SettingsDropdown = {
  abbreviation?: string;
  color?: string;
  description?: string;
  entity?: string;
  icon?: string;
  id: number;
  title: string;
  value?: string;
};

export type SettingsDropdownOverviewParams = {
  page?: number;
  entity: string;
  size?: number;
  id?: number;
};

import {employeeTabs} from '../screens/employees/constants';

export const getRouteName = (tabName: string) => {
  const tabIndex = employeeTabs.findIndex(tab => tab.title === tabName);
  return employeeTabs[tabIndex].routeName;
};

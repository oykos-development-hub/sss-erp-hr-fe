import {ValueType} from 'client-library/dist/components/dropdown/types';
import React, {useRef, useState} from 'react';
import EmployeeDetails from '../../components/employeeDetails/employeeDetails';
import EmployeesList from '../../components/employeesList/employeesList';
import NewEmployeeSearch from '../../components/newEmployeeSearch/newEmployeeSearch';
import useAppContext from '../../context/useAppContext';
import useUserProfiles from '../../services/graphql/userProfile/useUserProfiles';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {DropdownDataBoolean, DropdownDataNumber} from '../../types/dropdownData';
import {ScreenProps} from '../../types/screen-props';
import {useDebounce} from '../../utils/useDebounce';

export interface EmployeeListFilters {
  is_active?: DropdownDataBoolean | null;
  organization_unit_id?: DropdownDataNumber | null;
  job_position_id?: DropdownDataNumber | null;
  type?: DropdownDataNumber | null;
}

const initialValues: EmployeeListFilters = {
  is_active: null,
  organization_unit_id: null,
  job_position_id: null,
  type: null,
};

export const EmployeesScreen: React.FC<ScreenProps> = () => {
  const [page, setPage] = useState(1);
  const [employeeModal, setEmployeeModal] = useState(false);

  const [filters, setFilters] = useState<any>(initialValues);
  const [search, setSearch] = useState('');

  const screenWrapperRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {navigation} = useAppContext();

  const isDetails = navigation.location.pathname.split('/')[3] === 'details';

  const {userProfiles, total, loading} = useUserProfiles({page, size: 10, ...filters, name: debouncedSearch});

  const isNewEmployeeRoute = (): boolean => {
    const paths = navigation.location.pathname.split('/');
    return !!Number(paths[paths.length - 1]);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const toggleEmployeeImportModal = () => {
    setEmployeeModal(!employeeModal);
  };

  return (
    <ScreenWrapper ref={screenWrapperRef}>
      <EmployeesList
        navigation={navigation}
        onPageChange={onPageChange}
        toggleEmployeeImportModal={toggleEmployeeImportModal}
        data={{items: userProfiles, total}}
        filters={filters}
        search={search}
        onFilterChange={onFilterChange}
        onSearch={e => setSearch(e.target.value)}
        parentRef={screenWrapperRef}
        loading={loading}
      />
      {isDetails && <EmployeeDetails />}
    </ScreenWrapper>
  );
};

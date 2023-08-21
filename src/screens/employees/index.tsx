import {AlertVariants} from '@oykos-development/devkit-react-ts-styled-components';
import {Alert, CircleCheckIcon, DangerIcon, Typography} from 'client-library';
import {ValueType} from 'client-library/dist/components/dropdown/types';
import React, {useMemo, useRef, useState} from 'react';
import EmployeeDetails from '../../components/employeeDetails/employeeDetails';
import EmployeesList from '../../components/employeesList/employeesList';
import NewEmployeeSearch from '../../components/newEmployeeSearch/newEmployeeSearch';
import useUserProfiles from '../../services/graphql/userProfile/useUserProfiles';
import {AlertWrapper} from '../../shared/alertWrapper';
import {DropdownDataBoolean, DropdownDataNumber} from '../../types/dropdownData';
import {ScreenProps} from '../../types/screen-props';
import {useDebounce} from '../../utils/useDebounce';
import {ScreenWrapper} from '../../shared/screenWrapper';

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

export const EmployeesScreen: React.FC<ScreenProps> = ({context}) => {
  const [employeeModal, setEmployeeModal] = useState(false);
  const [alert, setAlert] = useState<{variant: AlertVariants; message: string}>({
    variant: AlertVariants.success,
    message: '',
  });
  const [filters, setFilters] = useState<any>(initialValues);
  const [search, setSearch] = useState('');

  const screenWrapperRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 500);

  const onFilterChange = (value: any, name: string) => {
    console.log(value);
    setFilters({...filters, [name]: value});
  };

  const [page, setPage] = useState(1);

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = context;

  const {data} = useUserProfiles({page, size: 10, ...filters, name: debouncedSearch});

  const isNewEmployeeRoute = useMemo(() => {
    const paths = pathname.split('/');
    if (Number(paths[paths.length - 1])) {
      return true;
    }
  }, [pathname]);

  const isDetails = pathname.split('/')[3] === 'details';

  const onSearch = (value: ValueType, name: string) => {
    console.log(value, name);
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const toggleEmployeeImportModal = () => {
    setEmployeeModal(!employeeModal);
  };

  return (
    <ScreenWrapper context={context} ref={screenWrapperRef}>
      <EmployeesList
        onPageChange={onPageChange}
        toggleEmployeeImportModal={toggleEmployeeImportModal}
        navigate={navigate}
        data={data}
        filters={filters}
        search={search}
        onFilterChange={onFilterChange}
        onSearch={e => setSearch(e.target.value)}
        parentRef={screenWrapperRef}
      />
      {isNewEmployeeRoute && <NewEmployeeSearch onSearch={onSearch} />}
      {isDetails && <EmployeeDetails context={context} setAlert={(alert: any) => setAlert(alert)} />}
      {alert.message && (
        <AlertWrapper>
          <Alert
            variant={alert.variant}
            content={<Typography variant="bodySmall" content={alert.message} />}
            icon={
              alert.variant === AlertVariants.success ? (
                <CircleCheckIcon fill={'none'} stroke={'white'} />
              ) : (
                <DangerIcon fill={'none'} stroke={'white'} />
              )
            }
            onClose={() => setAlert({variant: AlertVariants.success, message: ''})}
          />
        </AlertWrapper>
      )}
    </ScreenWrapper>
  );
};

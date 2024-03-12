import {Button, Divider, Pagination, SearchIcon, Table, Theme} from 'client-library';
import React, {ChangeEvent, RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {statusOptions} from '../../constants';
import {EmployeeListFilters} from '../../screens/employees';
import {tableHeads} from '../../screens/employees/constants';
import useGetJobPositions from '../../services/graphql/jobPositions/useGetJobPositions';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import {UserProfile} from '../../types/graphql/userProfiles';
import {scrollToTheNextElement} from '../../utils/scrollToTheNextElement';
import {Controls, FilterDropdown, FilterInput, Filters, Header, MainTitle, OverviewBox} from './styles';
import useAppContext from '../../context/useAppContext.ts';
import useGetUserProfiles from '../../services/graphql/userProfile/useGetUserProfiles.ts';
import {REQUEST_STATUSES} from '../../services/constants.ts';
import {importAnnualLeaveExcel} from '../../services/importExcel/importAnnualLeaveExcel.ts';
import {SingleUserVacationParams} from '../../types/graphql/vacations.ts';
import useInsertVacations from '../../services/graphql/userProfile/vacation/useInsertVacations.ts';
import {importExperienceExcel} from '../../services/importExcel/importExperienceExcel.ts';
import useInsertExperiences from '../../services/graphql/userProfile/experience/useInsertExperiences.ts';
import {ProfileExperience} from '../../types/graphql/experience.ts';

export interface EmployeesListProps {
  toggleEmployeeImportModal: () => void;
  onPageChange: (page: number) => void;
  search: string;
  filters: EmployeeListFilters;
  onFilterChange: (value: any, name: string) => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  parentRef: RefObject<HTMLDivElement>;
  loading: boolean;
  data: {
    items: UserProfile[];
    total: number;
  };
}

const EmployeesList: React.FC<EmployeesListProps> = ({
  onPageChange,
  data,
  search,
  filters,
  onFilterChange,
  onSearch,
  parentRef,
  loading,
}) => {
  const [selectedRowId, setSelectedRowId] = useState(0);
  const overviewRef = useRef<HTMLDivElement>(null);
  const {
    navigation: {
      location: {state, pathname},
      navigate,
    },
    alert,
    spreadsheetService: {openImportModal, closeImportModal},
    contextMain: {token},
  } = useAppContext();
  const isDetails = pathname.split('/').length === 6;

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const {jobPositions} = useGetJobPositions('');
  const {userProfiles} = useGetUserProfiles({
    page: 1,
    size: 10000,
  });
  const {insertVacations} = useInsertVacations();
  const {insertExperiences} = useInsertExperiences();

  const userProfileList = data.items
    ? data?.items?.map((item: UserProfile) => ({
        full_name: `${item.first_name} ${item.last_name}`,
        ...item,
        active: item.active ? 'Aktivan' : 'Neaktivan',
      }))
    : [];

  const jobPositionOptions = [
    {id: 0, title: 'Sva radna mjesta'},
    ...(jobPositions ? jobPositions.map((jobPosition: any) => ({id: jobPosition.id, title: jobPosition.title})) : []),
  ];

  useEffect(() => {
    if (state?.scroll || isDetails) {
      scrollToTheNextElement(parentRef, overviewRef);
    }
  }, [isDetails]);

  const sheetData = userProfiles?.map((item: UserProfile) => ({
    id: item.id,
    full_name: `${item.first_name} ${item.last_name}`,
    job_position: item.job_position?.title,
  }));

  const handleUploadAnnualLeaveTable = async (files: FileList) => {
    const response = await importAnnualLeaveExcel(files[0], token);
    if (response?.status === REQUEST_STATUSES.success) {
      if (response?.data?.length) {
        return response.data;
      }
      return null;
    } else {
      alert.error('Došlo je do greške prilikom učitavanja fajla!');
    }
  };

  const handleSubmitAnnualLeave = async (leaveData: SingleUserVacationParams[]) => {
    if (!leaveData?.length) return;
    const filteredData = leaveData.filter(item => item.number_of_days > 0);
    const currentYear = new Date().getFullYear();
    await insertVacations(
      {year: currentYear, data: filteredData},
      () => {
        alert.success('Godišnji odmori uspješno sačuvani.');
        closeImportModal();
      },
      () => {
        alert.error('Došlo je do greške prilikom čuvanja godišnjih odmora!');
      },
    );
  };

  const importAnnualLeave = () => {
    const modalProps = {
      type: 'IMPORT_ANNUAL_LEAVE',
      data: sheetData,
      onSubmit: handleSubmitAnnualLeave,
      handleUpload: handleUploadAnnualLeaveTable,
      content: 'Tabela godišnjih odmora',
    };
    openImportModal(modalProps);
  };

  const handleUploadExperienceTable = async (files: FileList) => {
    const response = await importExperienceExcel(files[0], token);
    if (response?.status === REQUEST_STATUSES.success) {
      if (response?.data?.length) {
        const updatedResponse = response.data.map(({updated_at, created_at, ...rest}: ProfileExperience) => rest);

        return updatedResponse;
      } else {
        if (response?.validation?.length) {
          return {
            // TODO change this in client container and all modules
            // currently it accepts just data but better option would be
            // {data: any[], errors: string[]} or
            // {data: any[], errors: {column: number; message: string; row: number}[]}
            // so that it can correctly handle the errors
            errors: response?.validation?.map(
              (error: {column: number; message: string; row: number}) =>
                `Red ${error.row}, Kolona ${error.column}: ${error.message}`,
            ),
          };
        }
      }
      return null;
    } else {
      alert.error('Došlo je do greške prilikom učitavanja fajla!');
    }
  };

  const importExperience = () => {
    const modalProps = {
      type: 'IMPORT_EXPERIENCE',
      data: sheetData,
      onSubmit: handleSubmitExperience,
      handleUpload: handleUploadExperienceTable,
      content: 'Tabela radnih knjižica',
    };
    openImportModal(modalProps);
  };
  const handleSubmitExperience = async (experienceData: ProfileExperience[]) => {
    await insertExperiences(
      {data: experienceData},
      () => {
        alert.success('Radne knjižice uspješno sačuvane.');
        closeImportModal();
      },
      () => {
        alert.error('Došlo je do greške prilikom čuvanja radnih knjižica!');
      },
    );
  };

  return (
    <OverviewBox ref={overviewRef}>
      <MainTitle variant="bodyMedium" content="PREGLED SVIH ZAPOSLENIH" />
      <Divider color={Theme?.palette?.gray200} height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="FILTER ORGANIZACIONIH JEDINICA:"
            options={organizationUnits}
            onChange={value => onFilterChange(value, 'organization_unit_id')}
            value={filters.organization_unit_id}
            name="organization_unit_id"
            placeholder="Odaberite organizacionu jedinicu"
          />

          <FilterDropdown
            label="RADNO MJESTO:"
            options={jobPositionOptions}
            onChange={value => onFilterChange(value, 'job_position_id')}
            value={filters.job_position_id}
            name="job_position_id"
            placeholder="Odaberite radno mjesto"
          />

          <FilterDropdown
            label="STATUS:"
            options={statusOptions as any}
            onChange={value => onFilterChange(value, 'is_active')}
            value={filters.is_active}
            name="is_active"
            placeholder="Odaberite status"
          />

          <FilterInput
            onChange={onSearch}
            label="PRETRAGA PO IMENU I PREZIMENU:"
            value={search}
            rightContent={<SearchIcon />}
            placeholder="Unesite ime i prezime"
          />
        </Filters>
        <Controls>
          {/*  Button should only be visible to HR*/}
          {/*  that role doesn't exist yet*/}
          <Button
            content="Plan godišnjih odmora"
            variant="secondary"
            style={{width: 170}}
            onClick={importAnnualLeave}
          />
          <Button content="Radna knjižica" variant="secondary" style={{width: 170}} onClick={importExperience} />
          <Button
            content="Dodajte zaposlenog"
            variant="secondary"
            style={{width: 170}}
            onClick={() => {
              navigate('/hr/employees/add-new');
            }}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={userProfileList}
        style={{marginBottom: 22}}
        isLoading={loading}
        selectedRowId={selectedRowId}
        onRowClick={(row: UserProfile) => {
          navigate(`/hr/employees/details/${row.id}/basic-info`);
          scrollToTheNextElement(parentRef, overviewRef);
          setSelectedRowId(row.id);
        }}
      />
      <Pagination
        pageCount={Math.ceil(data.total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        pageRangeDisplayed={3}
      />
    </OverviewBox>
  );
};

export default EmployeesList;

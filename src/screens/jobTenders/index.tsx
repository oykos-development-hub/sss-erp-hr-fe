import React, {useMemo, useState} from 'react';
import {JobTenderModal} from '../../components/jobTenderModal/jobTenderModal';
import JobTendersList from '../../components/jobTendersList/jobTendersList';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {JobTender} from '../../types/graphql/jobTenders';
import {ScreenProps} from '../../types/screen-props';
import {DropdownDataBoolean, DropdownDataNumber} from '../../types/dropdownData';
import useJobTendersOverview from '../../services/graphql/jobTenders/useJobTenderOverview';
import useJobTendersDelete from '../../services/graphql/jobTenders/useJobTenderDelete';
import useJobTendersTypesSearch from '../../services/graphql/jobPositions/useJobTendersTypesSearch';
import useJobPositionsOrganizationUnit from '../../services/graphql/jobPositions/useJobPositionsOrganizationUnit';

export interface JobTendersListFilters {
  active?: DropdownDataBoolean | null;
  organization_unit_id?: DropdownDataNumber | null;
  job_position_id?: DropdownDataNumber | null;
  type_id?: DropdownDataNumber | null;
}

const initialValues: JobTendersListFilters = {
  active: null,
  organization_unit_id: null,
  job_position_id: null,
  type_id: null,
};

export const JobTendersScreen: React.FC<ScreenProps> = ({context}) => {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const {types, typesUnitsList} = useJobTendersTypesSearch('');
  const {organizationUnits} = useOrganizationUnits(context);
  const {positions} = useJobPositionsOrganizationUnit(context?.organization_unit?.id);

  const [filters, setFilters] = useState<any>(initialValues);

  const {data, refetch, loading} = useJobTendersOverview({page, size: 10, ...filters});

  const selectedItem = useMemo(() => {
    return data?.items?.find((item: JobTender) => item.id === selectedItemId);
  }, [selectedItemId]);

  const {alert} = context;

  const handleEdit = (item?: JobTender) => {
    setSelectedItemId(item?.id ? item.id : 0);
    setShowModal(true);
  };

  const {mutate: deleteJobTenders} = useJobTendersDelete(
    () => {
      refetch();
      alert.success('Uspješno obrisano.');
    },
    () => {
      alert.error('Greška. Brisanje nije moguće.');
    },
  );

  const {
    navigation: {navigate},
  } = context;

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const toggleEmployeeImportModal = (item?: JobTender) => {
    setShowModal(!showModal);
    handleEdit(item);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const organizationUnitsList: any[] = useMemo(() => {
    return organizationUnits
      ? [
          {id: 0, title: 'Sve organizacione jedinice'},
          ...organizationUnits
            .filter(i => !i.parent_id)
            .map(unit => {
              return {id: unit.id, title: unit.title};
            }),
        ]
      : [];
  }, [organizationUnits]);

  return (
    <ScreenWrapper context={context}>
      <JobTendersList
        navigate={navigate}
        toggleJobTenderImportModal={toggleEmployeeImportModal}
        onPageChange={onPageChange}
        data={data}
        dropdownJobTenderType={typesUnitsList || []}
        organizationUnitsList={organizationUnitsList || []}
        filters={filters}
        onFilterChange={onFilterChange}
        deleteJobTender={deleteJobTenders}
        context={context}
        loading={loading}
      />
      {showModal && (
        <JobTenderModal
          open={showModal}
          onClose={handleCloseModal}
          selectedItem={selectedItem}
          dropdownJobTenderType={types?.items || []}
          organizationUnitsList={organizationUnitsList || []}
          refetch={refetch}
          alert={alert}
        />
      )}
    </ScreenWrapper>
  );
};

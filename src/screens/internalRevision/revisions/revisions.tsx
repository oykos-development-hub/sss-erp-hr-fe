import {Button, Divider, Dropdown, EditIconTwo, Table, Theme, TrashIconTwo, FileIcon} from 'client-library';
import React, {useState} from 'react';
import {RevisionModal} from '../../../components/revisionModal/revisionModal';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useDeleteRevision from '../../../services/graphql/revision/useDeleteRevision';
import useGetRevisions from '../../../services/graphql/revision/useGetRevisions';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {MicroserviceProps} from '../../../types/micro-service-props';
import {FilterContainer, Filters, MainTitle, RevisionListContainer, TableHeader} from '../styles';
import {RevisionTableHeads} from './constants';
import FileModalView from '../../../components/fileModalView/fileModalView';
import {FileItem} from '../../../components/fileModalView/types';

interface RevisionProps {
  context: MicroserviceProps;
}

const RevisionList: React.FC<RevisionProps> = ({context}) => {
  const [deleteModal, setDeleteModal] = useState(0);
  const [revisionModalShow, setRevisionModalShow] = useState(false);
  const planId = context?.navigation?.location?.pathname.split('/')[3];
  const planIdNumber = parseInt(planId);
  const [unitID, setUnitID] = useState(0);
  const [revisorId, setRevisorId] = useState<number>(0);
  const [revisonTypeId, setRevisonTypeId] = useState<number>(0);
  const [fileToView, setFileToView] = useState<FileItem>();

  const [editId, setEditId] = useState(0);
  const {revisions, loading, refetch} = useGetRevisions({
    page: 1,
    size: 1000,
    plan_id: planIdNumber,
    internal_revision_subject_id: unitID,
    revision_type_id: revisonTypeId,
    revisor_id: revisorId,
  });

  const {deleteRevision} = useDeleteRevision();
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});

  const toogleRevisionModal = (id: number) => {
    setEditId(id);
    setRevisionModalShow(!revisionModalShow);
  };

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  const handleDelete = () => {
    deleteRevision(
      deleteModal,
      () => {
        toggleDeleteModal(0);
        refetch();
        context.alert.success('Uspješno obrisano.');
      },
      () => {
        toggleDeleteModal(0);
        context.alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const handleEdit = (id: number) => {
    toogleRevisionModal(id);
  };

  const {settingsData} = useGetSettings({entity: 'revision_types'});

  const revisorsList = [
    {id: 0, title: 'Sve '},
    ...revisions.revisors.map((unit: DropdownDataNumber) => {
      return {id: unit.id, title: unit.title};
    }),
  ];

  const revisionTypeOptions = [
    {id: 0, title: 'Sve '},
    ...settingsData.map((unit: DropdownDataNumber) => {
      return {id: unit.id, title: unit.title};
    }),
  ];

  return (
    <ScreenWrapper>
      <RevisionListContainer>
        <MainTitle variant="bodyMedium" content="REVIZIJE" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        <TableHeader>
          <Filters>
            <FilterContainer>
              <Dropdown
                label="SUBJEKT REVIZIJE(interna)"
                value={organizationUnits?.find((option: any) => option?.id == unitID) as any}
                onChange={value => {
                  setUnitID(value.id as number);
                }}
                options={organizationUnits}
              />
            </FilterContainer>
            <FilterContainer>
              <Dropdown
                label="REVIZOR"
                value={revisorsList?.find((option: any) => option?.id == revisorId) as any}
                onChange={value => {
                  setRevisorId(value.id as number);
                }}
                options={revisorsList || []}
              />
            </FilterContainer>
            <FilterContainer>
              <Dropdown
                label="VRSTA REVIZIJE"
                value={revisionTypeOptions?.find((option: any) => option?.id === revisonTypeId) as any}
                onChange={value => {
                  setRevisonTypeId(value.id as number);
                }}
                options={revisionTypeOptions || []}
              />
            </FilterContainer>
          </Filters>

          <Button content="Dodajte reviziju" variant="secondary" onClick={() => toogleRevisionModal(0)} />
        </TableHeader>
        <Table
          tableHeads={RevisionTableHeads}
          data={revisions?.items || []}
          style={{marginBottom: 22}}
          isLoading={loading}
          onRowClick={row => {
            context.navigation.navigate(
              `/hr/revision-recommendations/${row?.plan_id}/revision/${row?.id}/recommendations`,
              {state: {dateOfRevision: row.date_of_revision}},
            );
            context.breadcrumbs.add({
              name: `Preporuke za ${row.title}`,
              to: `/hr/revision-recommendations/${row?.plan_id}/revision/${row?.id}/recommendations`,
            });
          }}
          tableActions={[
            {
              name: 'showFile',
              icon: <FileIcon stroke={Theme.palette.gray600} />,
              onClick: (row: any) => {
                setFileToView(row?.file);
              },
              shouldRender: (row: any) => row?.file?.id,
            },
            {
              name: 'Izmijeni',
              onClick: item => handleEdit(item.id),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'Obriši',
              onClick: item => toggleDeleteModal(item.id),
              icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />

        <ConfirmModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleConfirm={handleDelete} />
      </RevisionListContainer>

      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}
      {revisionModalShow && (
        <RevisionModal
          open={revisionModalShow}
          onClose={() => toogleRevisionModal(0)}
          refetchList={refetch}
          alert={context.alert}
          id={editId}
          planId={planIdNumber}
        />
      )}
    </ScreenWrapper>
  );
};

export default RevisionList;

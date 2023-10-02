import React from 'react';
import {Button, Divider, Dropdown, EditIconTwo, Table, Theme, TrashIconTwo} from 'client-library';
import {useMemo, useState} from 'react';
import {RevisionModal} from '../../../components/revisionModal/revisionModal';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import useRevisionDelete from '../../../services/graphql/revision/useRevisionDelete';
import useRevisionOverview from '../../../services/graphql/revision/useRevisionOverview';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {MicroserviceProps} from '../../../types/micro-service-props';
import {FilterContainer, Filters, MainTitle, RevisionListContainer, TableHeader} from '../styles';
import {RevisionTableHeads} from './constants';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';

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

  const [editId, setEditId] = useState(0);
  const {data, loading, refetch} = useRevisionOverview({
    page: 1,
    size: 1000,
    plan_id: planIdNumber,
    internal_revision_subject_id: unitID,
    revision_type_id: revisonTypeId,
    revisor_id: revisorId,
  });

  const {mutate} = useRevisionDelete();
  const {organizationUnits} = useOrganizationUnits();

  const toogleRevisionModal = (id: number) => {
    setEditId(id);
    setRevisionModalShow(!revisionModalShow);
  };

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  const handleDelete = () => {
    mutate(
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

  const {data: revisionTypes} = useSettingsDropdownOverview({entity: 'revision_types'});

  const organizationUnitsList: DropdownDataNumber[] = useMemo(() => {
    return organizationUnits
      ? [
          {id: 0, title: 'Sve '},
          ...organizationUnits
            .filter(i => !i.parent_id)
            .map(unit => {
              return {id: unit.id, title: unit.title};
            }),
        ]
      : [];
  }, [organizationUnits]);

  const revisorsList: DropdownDataNumber[] = useMemo(() => {
    return data.revisors
      ? [
          {id: 0, title: 'Sve '},
          ...data.revisors.map((unit: DropdownDataNumber) => {
            return {id: unit.id, title: unit.title};
          }),
        ]
      : [];
  }, [data]);

  const revisonTypeListOptions: DropdownDataNumber[] = useMemo(() => {
    return revisionTypes
      ? [
          {id: 0, title: 'Sve '},
          ...revisionTypes.map((unit: DropdownDataNumber) => {
            return {id: unit.id, title: unit.title};
          }),
        ]
      : [];
  }, [data]);

  console.log(revisonTypeListOptions, 'revisonTypeListOptions');

  console.log(revisonTypeId, 'v');
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
                value={organizationUnitsList?.find((option: any) => option?.id == unitID) as any}
                onChange={value => {
                  setUnitID(value.id as number);
                }}
                options={organizationUnitsList as any}
              />
            </FilterContainer>
            <FilterContainer>
              <Dropdown
                label="REVIZOR"
                value={revisorsList?.find((option: any) => option?.id == revisorId) as any}
                onChange={value => {
                  setRevisorId(value.id as number);
                }}
                options={revisorsList as any}
              />
            </FilterContainer>
            <FilterContainer>
              <Dropdown
                label="VRSTA REVIZIJE"
                value={revisonTypeListOptions?.find((option: any) => option?.id === revisonTypeId) as any}
                onChange={value => {
                  setRevisonTypeId(value.id as number);
                }}
                options={revisonTypeListOptions as any}
              />
            </FilterContainer>
          </Filters>

          <Button content="Dodaj reviziju" variant="secondary" onClick={() => toogleRevisionModal(0)} />
        </TableHeader>
        <Table
          tableHeads={RevisionTableHeads}
          data={data?.items || []}
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
              name: 'edit',
              onClick: item => handleEdit(item.id),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => toggleDeleteModal(item.id),
              icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />

        <DeleteModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleDelete={handleDelete} />
      </RevisionListContainer>

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

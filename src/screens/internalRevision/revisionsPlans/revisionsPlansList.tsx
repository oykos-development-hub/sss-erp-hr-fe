import React from 'react';
import {
  Button,
  Divider,
  Dropdown,
  EditIconTwo,
  MicroserviceProps,
  Table,
  TableHead,
  Theme,
  TrashIconTwo,
} from 'client-library';
import {useMemo, useState} from 'react';
import {RevisionPlanModal} from '../../../components/revisionPlanModal/revisionPlanModal';
import useRevisionPlanDelete from '../../../services/graphql/revisionsPlans/useRevisionPlanDelete';
import useRevisionPlanOverview from '../../../services/graphql/revisionsPlans/useRevisionPlanOverview';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {yearsForDropdownFilter} from '../../../utils/constants';
import {RevisionListContainer, MainTitle, TableHeader, FilterContainer} from '../styles';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';

interface RevisionPlanListProps {
  context: MicroserviceProps;
}
const TableHeads: TableHead[] = [
  {title: 'Godina', accessor: 'year'},
  {title: 'Naziv plana', accessor: 'name'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const RevisionPlansList: React.FC<RevisionPlanListProps> = ({context}) => {
  const years = yearsForDropdownFilter(1);
  const [deleteModal, setDeleteModal] = useState(0);
  const [revisionPlanModal, setRevisionPlanModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const [form, setForm] = useState<any>();

  const {mutate} = useRevisionPlanDelete();
  const {data, loading, refetch} = useRevisionPlanOverview({page: 1000, size: 1000});

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  const toogleRevisionPlanModal = (id: number) => {
    setEditId(id);
    setRevisionPlanModal(!revisionPlanModal);
  };

  const handleEdit = (id: number) => {
    toogleRevisionPlanModal(id);
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

  const handleChange = (value: any, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filteredTableData = useMemo(() => {
    if (form?.year?.id) {
      return data?.filter((item: any) => item.year.includes(form.year.id));
    }
    return data;
  }, [data, form?.year?.id]);

  return (
    <ScreenWrapper>
      <RevisionListContainer>
        <MainTitle variant="bodyMedium" content="GODIŠNJI PLAN REVIZIJA" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        <TableHeader>
          <FilterContainer>
            <Dropdown
              label="GODINA:"
              options={years}
              name="year"
              value={form?.year || null}
              onChange={handleChange}
              placeholder="Odaberite godinu:"
            />
          </FilterContainer>
          <Button content="Dodaj plan" variant="secondary" onClick={() => toogleRevisionPlanModal(0)} />
        </TableHeader>
        <Table
          tableHeads={TableHeads}
          data={filteredTableData || []}
          style={{marginBottom: 22}}
          isLoading={loading}
          onRowClick={row => {
            context.navigation.navigate(`/hr/revision-recommendations/${row.id}/revision`);
            context.breadcrumbs.add({
              name: `Revizije za ${row.name}`,
              to: `/hr/revision-recommendations/${row.id}/revision`,
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

      {revisionPlanModal && (
        <RevisionPlanModal
          open={revisionPlanModal}
          onClose={() => toogleRevisionPlanModal(0)}
          refetchList={refetch}
          alert={context.alert}
          id={editId}
        />
      )}
    </ScreenWrapper>
  );
};

export default RevisionPlansList;

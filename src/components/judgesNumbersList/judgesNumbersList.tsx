import {Button, Divider, EditIconTwo, Pagination, Table, Theme, TrashIcon, EyeIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {judgesNumberResolutionTableHeads} from '../../screens/judges/judgeNorms/constants';
import {JudgesNumberListFilters} from '../../screens/judges/judgesNumberDecisions/judgesNumberDecision';
import useDeleteJudgeResolution from '../../services/graphql/judges/resolutions/useDeleteJudgeResolution';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {DropdownDataString} from '../../types/dropdownData';
import {Controls, Filters, Header, MainTitle, OverviewBox} from '../judgesList/styles';
import {JudgeResolution} from '../../types/graphql/judgeResolutions';

export interface JudgesNumbersListProps {
  data: JudgeResolution[];
  total: number;
  years: DropdownDataString[];
  filters: JudgesNumberListFilters;
  onFilterChange: (value: any, name: string) => void;
  onPageChange: (page: number) => void;
  navigate: (path: string) => void;
  alert: any;
  refetch: () => void;
  loading: boolean;
}

const JudgesNumbersList: React.FC<JudgesNumbersListProps> = ({
  data,
  total,
  onPageChange,
  navigate,
  alert,
  refetch,
  loading,
}) => {
  const [deleteId, setDeleteId] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const {deleteJudgeResolution} = useDeleteJudgeResolution();

  const list: JudgeResolution[] = useMemo(
    () =>
      data?.map((item: JudgeResolution) => ({
        ...item,
      })),
    [data],
  );

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteJudgeResolution(
        deleteId,
        () => {
          refetch();
          alert.success('Uspješno obrisano.');
          setDeleteModal(false);
        },
        () => {
          alert.error('Greška. Brisanje nije moguće.');
          setDeleteModal(false);
        },
      );
    }
  };

  return (
    <OverviewBox>
      <MainTitle variant="bodyMedium" content="PREGLED ODLUKA O BROJU SUDIJA I PREDSJEDNIKA" />
      <Divider color="#615959" height="1px" />
      <Header>
        <Filters></Filters>
        <Controls>
          <Button
            content="Dodaj odluku"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/hr/judges/number-decision/new-decision')}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={judgesNumberResolutionTableHeads}
        data={list}
        style={{marginBottom: 22}}
        isLoading={loading}
        tableActions={[
          {
            name: 'edit',
            onClick: row => navigate(`/hr/judges/number-decision/${row.id}`),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: (decision: JudgeResolution) => !!decision.active,
          },
          {
            name: 'edit',
            onClick: row => navigate(`/hr/judges/number-decision/${row.id}`),
            icon: <EyeIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: (decision: JudgeResolution) => !decision.active,
          },
          {
            name: 'delete',
            onClick: item => openDeleteModal(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: (decision: JudgeResolution) => !decision.active,
          },
        ]}
      />
      <Pagination
        pageCount={Math.ceil(total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        pageRangeDisplayed={3}
      />
      <DeleteModal open={deleteModal} onClose={() => setDeleteModal(false)} handleDelete={handleDelete} />
    </OverviewBox>
  );
};

export default JudgesNumbersList;

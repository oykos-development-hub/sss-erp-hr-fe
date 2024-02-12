import {Button, Divider, EditIconTwo, Pagination, Table, Theme, TrashIcon, DownloadIcon, EyeIcon} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {judgesNumberResolutionTableHeads} from '../../screens/judges/judgeNorms/constants';
import {JudgesNumberListFilters} from '../../screens/judges/judgesNumberDecisions/judgesNumberDecision';
import useDeleteJudgeResolution from '../../services/graphql/judges/resolutions/useDeleteJudgeResolution';
import {ConfirmModal} from '../../shared/confirmModal/confirmModal';
import {DropdownDataString} from '../../types/dropdownData';
import {Controls, Filters, Header, MainTitle, OverviewBox} from '../judgesList/styles';
import {JudgeResolution, JudgeResolutionItem} from '../../types/graphql/judgeResolutions';
import useOrganizationUintCalculateEmployeeStats from '../../services/graphql/judges/resolutions/useGetCurrentResolutionNumbers';
import useAppContext from '../../context/useAppContext';

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
  const [resolutionId, setResolutionId] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const {refetch: fetchJudgesData} = useOrganizationUintCalculateEmployeeStats({
    resolution_id: resolutionId || null,
  });
  const {deleteJudgeResolution} = useDeleteJudgeResolution();
  const {
    reportService: {generatePdf},
  } = useAppContext();
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

  useEffect(() => {
    if (resolutionId) {
      fetchJudgesData(res => {
        const reportData = res?.map((item: any) => ({
          organization_unit: item.organization_unit.title,
          available_slots_presidents: item.available_slots_presidents,
          available_slots_judges: item.available_slots_judges,
          available_slots_total: item.available_slots_total,
          number_of_judges: item.number_of_judges,
          number_of_presidents: item.number_of_presidents,
          total_number: item.total_number,
          vacant_slots: item.vacant_slots,
          vacant_slots_judges: item.vacant_slots_judges,
          vacant_slots_presidents: item.vacant_slots_presidents,
        }));
        generatePdf('JUDGE_NUMBER_DECISION_REPORT', {reportData});
      });
    }
  }, [resolutionId]);

  return (
    <OverviewBox>
      <MainTitle variant="bodyMedium" content="PREGLED ODLUKA O BROJU SUDIJA I PREDSJEDNIKA" />
      <Divider color="#615959" height="1px" />
      <Header>
        <Filters></Filters>
        <Controls>
          <Button
            content="Dodajte odluku"
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
            name: 'Izmijeni',
            onClick: row => navigate(`/hr/judges/number-decision/${row.id}`),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: row => row.active,
          },
          {
            name: 'Pregled',
            onClick: row => navigate(`/hr/judges/number-decision/${row.id}`),
            icon: <EyeIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => !row.active,
          },
          {
            name: 'Preuzmi',
            onClick: row => setResolutionId(row.id),
            icon: <DownloadIcon stroke={Theme.palette.gray800} />,
            shouldRender: (decision: JudgeResolution) => !!decision.active,
          },
          {
            name: 'Obriši',
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
      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} handleConfirm={handleDelete} />
    </OverviewBox>
  );
};

export default JudgesNumbersList;

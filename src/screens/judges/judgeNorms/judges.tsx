import React, {useEffect, useMemo, useRef, useState} from 'react';
import JudgeNormModal from '../../../components/judgeNormModal/judgeNormModal';
import JudgesList from '../../../components/judgesList/judgesList';
import NormsList from '../../../components/normsList/normsList';
import useDeleteJudgeNorm from '../../../services/graphql/judges/norms/useDeleteJudgeNorm';
import useGetJudges from '../../../services/graphql/judges/useGetJudges';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {JudgeNorm} from '../../../types/graphql/judgeNorms';
import {Judge} from '../../../types/graphql/judges';
import {ScreenProps} from '../../../types/screen-props';

export interface JudgesListFilters {
  organization_unit: DropdownDataNumber | null;
  user_profile: DropdownDataNumber | null;
}

const initialValues: JudgesListFilters = {
  organization_unit: null,
  user_profile: null,
};

const JudgeNorms: React.FC<ScreenProps> = ({context}) => {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [selectedNormItemId, setSelectedNormItemId] = useState(0);
  const [normsList, setNormsList] = useState<JudgeNorm[]>([]);
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});

  const [filters, setFilters] = useState<JudgesListFilters>(initialValues);

  const {judges, total, refetch, loading} = useGetJudges({page, size: 10, ...filters});
  const {judgeOptions} = useGetJudges({page, size: 1000, ...initialValues});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const screenWrapperRef = useRef<HTMLDivElement>(null);

  let isNorm: boolean;
  isNorm = normsList.length > 0;

  const selectedNormItem = useMemo(() => {
    return normsList?.find((item: JudgeNorm) => item.id === selectedNormItemId);
  }, [selectedNormItemId]);

  const normsListSet = () => {
    const item = judges?.find((item: Judge) => item.id === selectedItemId);
    setNormsList([
      ...(item?.norms || []).map(norm => ({
        ...norm,
        full_name: item?.full_name,
      })),
    ]);
  };

  useEffect(() => {
    normsListSet();
  }, [judges, selectedItemId]);

  const {deleteJudgeNorm} = useDeleteJudgeNorm();

  const openNormModal = (item?: JudgeNorm) => {
    setShowModal(true);
    setSelectedNormItemId(item?.id || 0);
  };

  const toggleJudgesNorms = (item?: Judge) => {
    setSelectedItemId(item?.id || 0);
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNormItemId(0);
  };

  const handleDelete = () => {
    deleteJudgeNorm(
      selectedNormItemId,
      () => {
        refetch();
        context.success('Uspješno obrisano');
      },
      () => {
        context.error('Brisanje nije uspješno');
      },
    );
    setShowDeleteModal(false);
    setSelectedNormItemId(0);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedNormItemId(id);
  };

  return (
    <ScreenWrapper ref={screenWrapperRef}>
      <JudgesList
        toggleJudgesNorms={toggleJudgesNorms}
        onPageChange={onPageChange}
        data={judges || []}
        usersUnitsList={judgeOptions}
        organizationUnitsList={organizationUnits}
        filters={filters}
        onFilterChange={onFilterChange}
        total={total}
        addNorm={() => openNormModal()}
        loading={loading}
        parentRef={screenWrapperRef}
        isNorm={isNorm}
      />

      {isNorm && (
        <NormsList
          data={normsList}
          toggleNormsModal={item => openNormModal(item)}
          handleDeleteIconClick={handleDeleteIconClick}
          loading={loading}
        />
      )}

      <JudgeNormModal
        alert={context.alert}
        refetchList={refetch}
        open={showModal}
        onClose={handleCloseModal}
        selectedItem={selectedNormItem}
        dropdownData={judgeOptions}
      />
      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
    </ScreenWrapper>
  );
};

export default JudgeNorms;

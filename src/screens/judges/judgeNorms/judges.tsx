import React, {useEffect, useMemo, useState} from 'react';
import {ScreenProps} from '../../../types/screen-props';
import useJudgesOverview from '../../../services/graphql/judges/useJudgeOverview';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {JudgeOverview, Norms} from '../../../types/graphql/judges';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import JudgeNormModal from '../../../components/judgeNormModal/judgeNormModal';
import NormsList from '../../../components/normsList/normsList';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import JudgesList from '../../../components/judgesList/judgesList';
import useJudgeNormsDelete from '../../../services/graphql/judges/useJudgeNormDelete';

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
  const [normsList, setNormsList] = useState<Norms[]>([]);
  const {organizationUnits} = useOrganizationUnits(context);

  const [filters, setFilters] = useState<JudgesListFilters>(initialValues);

  const {data, total, refetch, loading} = useJudgesOverview({page, size: 10, ...filters});
  const {judgesUnitsList} = useJudgesOverview({page, size: 1000, ...initialValues});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const organizationUnitsList = useMemo(() => {
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

  const selectedNormItem = useMemo(() => {
    return normsList?.find((item: Norms) => item.id === selectedNormItemId);
  }, [selectedNormItemId]);

  const normsListSet = () => {
    const item = data?.find((item: JudgeOverview) => item.id === selectedItemId);
    setNormsList([
      ...(item?.norms || []).map(norm => ({
        ...norm,
        full_name: item?.full_name,
      })),
    ]);
  };

  useEffect(() => {
    normsListSet();
  }, [data, selectedItemId]);

  const {mutate: deleteJudgeNorm} = useJudgeNormsDelete(
    () => {
      refetch();
      context.success('Uspješno obrisano');
    },
    () => {
      context.error('Brisanje nije uspješno');
    },
  );

  const openNormModal = (item?: Norms) => {
    setShowModal(true);
    setSelectedNormItemId(item?.id || 0);
  };

  const toggleJudgesNorms = (item?: JudgeOverview) => {
    setSelectedItemId(item?.id || 0);
    normsListSet();
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
    deleteJudgeNorm(selectedNormItemId);
    setShowDeleteModal(false);
    setSelectedNormItemId(0);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedNormItemId(id);
  };

  return (
    <ScreenWrapper context={context}>
      <JudgesList
        toggleJudgesNorms={toggleJudgesNorms}
        onPageChange={onPageChange}
        data={data || []}
        usersUnitsList={judgesUnitsList}
        organizationUnitsList={organizationUnitsList || []}
        filters={filters}
        onFilterChange={onFilterChange}
        total={total}
        addNorm={() => openNormModal()}
        loading={loading}
      />
      {normsList.length > 0 && (
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
        dropdownData={judgesUnitsList}
      />
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </ScreenWrapper>
  );
};

export default JudgeNorms;

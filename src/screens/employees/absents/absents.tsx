import {Divider} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Dropdown, EditIconTwo, Table, Theme, TrashIcon, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {AbsentModal} from '../../../components/absentsModal/absentsModal';
import {VacationModal} from '../../../components/vacationModal/VacationModal';
import useAbsentDelete from '../../../services/graphql/userProfile/absents/useDeleteAbsence';
import useGetAbsence from '../../../services/graphql/userProfile/absents/useGetAbsence';
import useGetAbsenceTypes from '../../../services/graphql/userProfile/absents/useGetAbsentsType';
import useResolutionDelete from '../../../services/graphql/userProfile/resolution/useResolutionDelete';
import useVacationGet from '../../../services/graphql/userProfile/vacation/useVacationGet';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {Absence, AbsenceParams} from '../../../types/graphql/absents';
import {UserProfileVacationParams, YearVacationType} from '../../../types/graphql/profileVacationTypes';
import {MicroserviceProps} from '../../../types/micro-service-props';
import {yearsForDropdownFilter} from '../../../utils/constants';
import {tableHeadsAbsence, tableHeadsVacation, tableHeadsYearVacation} from './constants';
import {
  ButtonWrapper,
  Container,
  Subtitle,
  SuperTitle,
  TableHeader,
  TableTitle,
  Title,
  VacationContainer,
  VacationWrapper,
  YearContainer,
  YearWrapper,
} from './styles';

const Absents: React.FC<{context: MicroserviceProps}> = ({context}) => {
  const years = yearsForDropdownFilter();
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {absence, refetch, summary} = useGetAbsence(userProfileID);
  const {vacationData, refetchUserVacation} = useVacationGet(userProfileID);
  const [firstTableData, setFirstTableData] = useState<Absence[]>([]);
  const [secondTableData, setSecondTableData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [form, setForm] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {absenceTypes, loading} = useGetAbsenceTypes();
  const {mutate} = useAbsentDelete();
  const {mutate: vacationDelete} = useResolutionDelete();
  const [editItem, setEditItem] = useState<Absence | undefined>();
  const [editItemVacation, setEditItemVacation] = useState<YearVacationType | undefined>();
  const [showDeleteVacationModal, setShowDeleteVacationModal] = useState<boolean>(false);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleAddVacation = () => {
    setShowVacationModal(true);
  };

  const handleDelete = async () => {
    mutate(
      selectedItemId,
      () => {
        refetch();
        context.alert.success('Uspješno obrisano.');
        setShowDeleteModal(false);
        setSelectedItemId(0);
      },
      () => {
        context.alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const handleDeleteVacation = async () => {
    vacationDelete(
      selectedItemId,
      () => {
        refetchUserVacation();
        refetch();
        context.alert.success('Uspješno obrisano.');
        setShowDeleteVacationModal(false);
        setSelectedItemId(0);
      },
      () => {
        context.alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const handleCloseAbsentsModal = (shouldRefetch?: boolean) => {
    setShowModal(false);
    setSelectedItemId(0);
    setEditItem(undefined);
    shouldRefetch && refetch();
  };

  const handleCloseVacationModal = (shouldRefetch: boolean) => {
    setShowVacationModal(false);
    setSelectedItemId(0);
    setEditItemVacation(undefined);
    refetch();
    shouldRefetch && refetchUserVacation();
  };

  const handleEdit = (item: AbsenceParams) => {
    setShowModal(true);
    setEditItem(absence?.find(tableItem => tableItem.id === item.id));
  };

  const handleEditVacation = (item: UserProfileVacationParams) => {
    setShowVacationModal(true);
    setEditItemVacation(vacationData?.find(tableItem => tableItem.id === item.id));
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDeleteVacationIconClick = (id: number) => {
    setShowDeleteVacationModal(true);
    setSelectedItemId(id);
  };

  const handleChange = (value: any, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filterFirstTableData = () => {
    if (absence) {
      const filteredData = [...absence].filter(absent => !absent?.absent_type?.accounting_days_off);
      setFirstTableData(filteredData);
      return filteredData;
    } else {
      setFirstTableData([]);
      return [];
    }
  };

  const filterSecondTableData = () => {
    if (absence) {
      const filteredData = absence.filter(item => item?.absent_type?.accounting_days_off);
      const combinedData = [...filteredData];
      setSecondTableData(combinedData);
      return combinedData;
    } else {
      setSecondTableData([]);
      return [];
    }
  };

  const filteredFirstTableData = useMemo(() => {
    return (
      firstTableData?.filter((item: Absence) => {
        const yearMatches = !form?.year?.id || item.date_of_start.includes(form.year.id);
        return yearMatches;
      }) || []
    );
  }, [firstTableData, form?.year?.id]);

  const filteredSecondTableData = useMemo(() => {
    return (
      secondTableData?.filter((item: Absence) => {
        const yearMatches = !form?.year?.id || item.date_of_start.includes(form.year.id);
        return yearMatches;
      }) || []
    );
  }, [secondTableData, form?.year?.id]);

  const filterVacationData = () => {
    if (!form) {
      return vacationData || [];
    }
    const isAllYearSelected = form?.year.id.toString() === '';
    const filteredData = vacationData?.filter(item => {
      return isAllYearSelected || item.year === form.year.id;
    });

    return filteredData || [];
  };

  useEffect(() => {
    filterFirstTableData();
    filterSecondTableData();
  }, [absence, vacationData]);

  return (
    <Container>
      <VacationWrapper>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.current_available_days}` || null}></SuperTitle>
          <Title variant="bodySmall" content="DOSTUPNI DANI GODIŠNJEG ODMORA" />
          <Subtitle variant="bodySmall" content="TEKUĆA GODINA" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.past_available_days}` || null}></SuperTitle>
          <Title variant="bodySmall" content="DOSTUPNI DANI GODIŠNJEG ODMORA" />
          <Subtitle variant="bodySmall" content="PRETHODNA GODINA" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.used_days}` || ''}></SuperTitle>
          <Title variant="bodySmall" content="ISKORIŠTENI DANI U TEKUĆOJ GODINI" />
          <Subtitle variant="bodySmall" content="" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle
            variant="bodySmall"
            content={`${summary ? summary?.current_available_days + summary?.past_available_days : ''}`}></SuperTitle>
          <Title variant="bodySmall" content="UKUPNO RASPOLOŽIVIH DANA " />
          <Subtitle variant="bodySmall" content="TEKUĆA + PRETHODNA" />
        </VacationContainer>
      </VacationWrapper>
      <TableHeader>
        <YearWrapper>
          <YearContainer>
            <Dropdown
              label={<Typography variant="bodySmall" content="GODINA:" />}
              options={years}
              name="year"
              value={form?.year || null}
              placeholder="Odaberite godinu:"
              onChange={handleChange}
            />
          </YearContainer>
        </YearWrapper>

        <ButtonWrapper>
          <Button
            variant="secondary"
            content={<Typography variant="bodyMedium" content="Rješenje o godišnjem odmoru" />}
            onClick={handleAddVacation}
          />
          <Button
            variant="secondary"
            content={<Typography variant="bodyMedium" content="Zahtjevi" />}
            onClick={handleAdd}
            style={{marginLeft: '10px'}}
          />
        </ButtonWrapper>
      </TableHeader>
      <div>
        <div>
          <TableTitle content="GODIŠNJI ODMORI" variant="bodyMedium" />
          <Divider height="1px" style={{marginBottom: '30px'}} />
        </div>
        <Table
          tableHeads={tableHeadsYearVacation}
          data={filterVacationData() || []}
          isLoading={loading}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEditVacation(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteVacationIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>

      <div>
        <div>
          <TableTitle content="ODMORI" variant="bodyMedium" />
          <Divider height="1px" style={{marginBottom: '30px'}} />
        </div>
        <Table
          tableHeads={tableHeadsVacation}
          data={filteredSecondTableData || []}
          isLoading={loading}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>
      <div>
        <div>
          <TableTitle content="ODSUTNOST" variant="bodyMedium" />
          <Divider height="1px" />
        </div>
        <Table
          tableHeads={tableHeadsAbsence}
          data={filteredFirstTableData || []}
          isLoading={loading}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>
      {showModal && (
        <AbsentModal
          open={showModal}
          onClose={refetch => handleCloseAbsentsModal(refetch)}
          selectedItem={editItem}
          userProfileId={Number(userProfileID)}
          alert={context.alert}
          absenceTypes={absenceTypes || []}
          key={editItem ? editItem.id : 'new'}
        />
      )}
      {showVacationModal && (
        <VacationModal
          open={showVacationModal}
          onClose={refetch => handleCloseVacationModal(refetch)}
          selectedItem={editItemVacation}
          userProfileId={Number(userProfileID)}
          alert={context.alert}
          key={editItemVacation ? editItemVacation.id : 'new'}
        />
      )}

      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
      <ConfirmModal
        open={showDeleteVacationModal}
        handleConfirm={handleDeleteVacation}
        onClose={() => setShowDeleteVacationModal(false)}
      />
    </Container>
  );
};

export default Absents;

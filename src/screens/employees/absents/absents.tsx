import {Divider, ValueType} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Dropdown, EditIconTwo, Table, Theme, TrashIcon, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {AbsentModal} from '../../../components/absentsModal/absentsModal';
import useAbsentDelete from '../../../services/graphql/userProfile/absents/useAbsentDelete';
import useAbsentOverview from '../../../services/graphql/userProfile/absents/useAbsentOverview';
import useAbsentTypesOverview from '../../../services/graphql/userProfile/absents/useAbsentsType';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileAbsents, UserProfileAbsentsParams, VacationType} from '../../../types/graphql/profileAbsentsTypes';
import {MicroserviceProps} from '../../../types/micro-service-props';
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

import {VacationModal} from '../../../components/vacationModal/VacationModal';
import useVacationGet from '../../../services/graphql/userProfile/vacation/useVacationGet';
import {yearsForDropdownFilter} from '../../../utils/constants';
import {tableHeadsAbsence, tableHeadsVacation, tableHeadsYearVacation} from './constants';
import {UserProfileVacationParams, YearVacationType} from '../../../types/graphql/profileVacationTypes';
import useVacationDelete from '../../../services/graphql/userProfile/absents/useVacationDelete';

const Absents: React.FC<{context: MicroserviceProps}> = ({context}) => {
  const years = yearsForDropdownFilter();
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {absentsData, refetchData, summary} = useAbsentOverview(userProfileID);
  const {vacationData, refetcUserVacation} = useVacationGet(userProfileID);
  const [firstTableData, setFirstTableData] = useState<UserProfileAbsents[]>([]);
  const [secondTableData, setSecondTableData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [form, setForm] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {absentsTypeData, loading} = useAbsentTypesOverview();
  const {mutate} = useAbsentDelete();
  const {deleteVacation} = useVacationDelete();
  const [editItem, setEditItem] = useState<UserProfileAbsents | undefined>();
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
        refetchData();
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
    deleteVacation(
      selectedItemId,
      () => {
        refetcUserVacation();
        context.alert.success('Uspješno obrisano.');
        setShowDeleteVacationModal(false);
        setSelectedItemId(0);
      },
      () => {
        context.alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const handleCloseAbsentsModal = (refetch?: boolean) => {
    setShowModal(false);
    setSelectedItemId(0);
    setEditItem(undefined);
    refetch && refetchData();
  };

  const handleCloseVacationModal = (refetch?: boolean) => {
    setShowVacationModal(false);
    setSelectedItemId(0);
    setEditItemVacation(undefined);
    refetch && refetcUserVacation();
  };

  const handleEdit = (item: UserProfileAbsentsParams) => {
    setShowModal(true);
    setEditItem(absentsData?.find(tableItem => tableItem.id === item.id));
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

  const handleChange = (value: ValueType, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filterFirstTableData = () => {
    if (absentsData) {
      const filteredData = [...absentsData].filter(absent => !absent?.absent_type?.accounting_days_off);
      setFirstTableData(filteredData);
      return filteredData;
    } else {
      setFirstTableData([]);
      return [];
    }
  };

  const filterSecondTableData = () => {
    if (absentsData) {
      const filteredData = absentsData.filter(item => item?.absent_type?.accounting_days_off);
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
      firstTableData?.filter((item: UserProfileAbsents) => {
        const yearMatches = !form?.year?.id || item.date_of_start.includes(form.year.id);
        return yearMatches;
      }) || []
    );
  }, [firstTableData, form?.year?.id]);

  const filteredSecondTableData = useMemo(() => {
    return (
      secondTableData?.filter((item: UserProfileAbsents) => {
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
  }, [absentsData, vacationData]);

  return (
    <Container>
      <VacationWrapper>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.current_available_days}` || null}></SuperTitle>
          <Title variant="bodySmall" content="DOSTUPNIH DANA" />
          <Subtitle variant="bodySmall" content="TRENUTNA GODINA" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.past_available_days}` || null}></SuperTitle>
          <Title variant="bodySmall" content="DOSTUPNIH DANA" />
          <Subtitle variant="bodySmall" content="PRETHODNA GODINA" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.used_days}` || ''}></SuperTitle>
          <Title variant="bodySmall" content="UZETI DANI" />
          <Subtitle variant="bodySmall" content="" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle
            variant="bodySmall"
            content={`${summary ? summary?.current_available_days + summary?.past_available_days : ''}`}></SuperTitle>
          <Title variant="bodySmall" content="UKUPNO RASPOLOŽIVIH DANA" />
          <Subtitle variant="bodySmall" content="TEKUĆA + PRETHODNE" />
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
              // @ts-ignore
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
          absentTypes={absentsTypeData || []}
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

      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
      <DeleteModal
        open={showDeleteVacationModal}
        handleDelete={handleDeleteVacation}
        onClose={() => setShowDeleteVacationModal(false)}
      />
    </Container>
  );
};

export default Absents;

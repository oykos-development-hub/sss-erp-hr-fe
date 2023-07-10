import React, {useEffect, useMemo, useState} from 'react';
import {TableHead, Dropdown, Typography, Table, EditIconTwo, TrashIcon, Theme, Button} from 'client-library';
import {
  Container,
  Subtitle,
  SuperTitle,
  Title,
  TableHeader,
  VacationContainer,
  VacationWrapper,
  YearContainer,
  YearWrapper,
  TableTitle,
} from './styles';
import {UserProfileAbsents, UserProfileAbsentsParams} from '../../../types/graphql/profileAbsentsTypes';
import {Divider, ValueType} from '@oykos-development/devkit-react-ts-styled-components';
import {AbsentModal} from '../../../components/absentsModal/absentsModal';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {MicroserviceProps} from '../../../types/micro-service-props';
import {
  dropdownAbsentsOptions,
  dropdownVacationOptions,
  vacationTypeList,
} from '../../../components/absentsModal/constants';
import {parseDate} from '../../../utils/dateUtils';
import {DropdownDataString} from '../../../types/dropdownData';
import useAbsentOverview from '../../../services/graphql/userProfile/absents/useAbsentOverview';
import useAbsentDelete from '../../../services/graphql/userProfile/absents/useAbsentDelete';

const tableHeads: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (_, item: any) => {
      return <Typography variant="bodyMedium" content={parseDate(item.date_of_start, true)} />;
    },
  },
  {
    title: 'Vrsta prilagodbe',
    accessor: 'vacation_type',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
  },
  {
    title: 'Dana',
    accessor: '',
    type: 'custom',
    renderContents: (_, item: any) => {
      const startDate = new Date(item.date_of_start);
      const endDate = new Date(item.date_of_end);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const numberOfDays = Math.floor(timeDiff / (1000 * 3600 * 24));

      return <Typography variant="bodyMedium" content={numberOfDays} />;
    },
  },
  {title: 'Datoteka', accessor: 'file_id', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const currentYear = new Date().getFullYear();

const YearList: DropdownDataString[] = Array.from({length: 10}, (_, index) => {
  const year = currentYear - index;
  return {id: year.toString(), title: year.toString()};
});

const Absents: React.FC<{context: MicroserviceProps}> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[3];
  const {absentsData, refetchData, summary} = useAbsentOverview(userProfileID);
  const tableData = absentsData || [];
  const [firstTableData, setFirstTableData] = useState<UserProfileAbsents[]>([]);
  const [secondTableData, setSecondTableData] = useState<UserProfileAbsents[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [form, setForm] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {mutate} = useAbsentDelete();

  const selectedItem = useMemo(() => {
    if (selectedItemId) {
      return tableData.find((item: UserProfileAbsents) => item.id === selectedItemId);
    }
    return null;
  }, [selectedItemId]);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleDelete = async () => {
    mutate(
      selectedItemId,
      selectedItem?.vacation_type.id || 0,
      () => {
        refetchData();
        context.alert.success('Uspješno obrisano');
        setShowDeleteModal(false);
        setSelectedItemId(0);
      },
      () => {
        context.alert.error('Brisanje nije uspješno');
      },
    );
  };

  const handleCloseModal = (refetch: boolean) => {
    setShowModal(false);
    setSelectedItemId(0);
    refetch && refetchData();
  };

  const handleEdit = (item: UserProfileAbsentsParams) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
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
      const filteredData = absentsData.filter(item =>
        dropdownAbsentsOptions.some(option => option.id === item.vacation_type?.id),
      );
      setFirstTableData(filteredData);
      return filteredData;
    } else {
      setFirstTableData([]);
      return [];
    }
  };

  const filterSecondTableData = () => {
    if (absentsData) {
      const filteredData = absentsData.filter(item =>
        dropdownVacationOptions.some(option => option.id === item.vacation_type?.id),
      );
      setSecondTableData(filteredData);
      return filteredData;
    } else {
      setSecondTableData([]);
      return [];
    }
  };

  const filteredFirstTableData = useMemo(() => {
    if (form?.year?.id && form?.vacation_type?.id) {
      return firstTableData.filter((item: UserProfileAbsents) => {
        return item.date_of_start.includes(form.year.id) && item.vacation_type.id === form.vacation_type.id;
      });
    } else if (form?.year?.id) {
      return firstTableData.filter((item: UserProfileAbsents) => item.date_of_start.includes(form.year.id));
    } else if (form?.vacation_type?.id) {
      return firstTableData.filter((item: UserProfileAbsents) => item.vacation_type.id === form.vacation_type.id);
    }
    return firstTableData;
  }, [firstTableData, form?.year?.id, form?.vacation_type?.id]);

  const filteredSecondTableData = useMemo(() => {
    if (form?.year?.id && form?.vacation_type?.id) {
      return secondTableData.filter((item: UserProfileAbsents) => {
        return item.date_of_start.includes(form.year.id) && item.vacation_type.id === form.vacation_type.id;
      });
    } else if (form?.year?.id) {
      return secondTableData.filter((item: UserProfileAbsents) => item.date_of_start.includes(form.year.id));
    } else if (form?.vacation_type?.id) {
      return secondTableData.filter((item: UserProfileAbsents) => item.vacation_type.id === form.vacation_type.id);
    }
    return secondTableData;
  }, [firstTableData, form?.year?.id, form?.vacation_type?.id]);

  useEffect(() => {
    filterFirstTableData();
    filterSecondTableData();
  }, [absentsData]);

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
          <Subtitle variant="bodySmall" content="PRETHODNOG POSLODAVCA" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle variant="bodySmall" content={`${summary?.used_days}` || ''}></SuperTitle>
          <Title variant="bodySmall" content="UZETI DANI" />
          <Subtitle variant="bodySmall" content="" />
        </VacationContainer>
        <VacationContainer>
          <SuperTitle
            variant="bodySmall"
            content={`${
              summary ? summary?.current_available_days + summary?.past_available_days - summary?.used_days : ''
            }`}></SuperTitle>
          <Title variant="bodySmall" content="UKUPNO RASPOLOŽIVIH DANA" />
          <Subtitle variant="bodySmall" content="TEKUĆA + PRETHODNE" />
        </VacationContainer>
      </VacationWrapper>
      <TableHeader>
        <YearWrapper>
          <YearContainer>
            <Dropdown
              label={<Typography variant="bodySmall" content="GODINA:" />}
              options={YearList}
              name="year"
              value={form?.year || null}
              placeholder="Odaberite godinu:"
              onChange={handleChange}
            />
          </YearContainer>
          <YearContainer>
            <Dropdown
              label={<Typography variant="bodySmall" content="TIP ZAHTJEVA:" />}
              options={vacationTypeList}
              name="vacation_type"
              value={form?.vacation_type || null}
              placeholder="Odaberite tip zahtjeva:"
              onChange={handleChange}
            />
          </YearContainer>
        </YearWrapper>

        <div>
          <Button
            variant="secondary"
            content={<Typography variant="bodyMedium" content="Zahtjevi" />}
            onClick={handleAdd}
          />
        </div>
      </TableHeader>
      <div>
        <div>
          <TableTitle content="ODSUTNOST" variant="bodyMedium" />
          <Divider height="1px" />
        </div>
        <Table
          tableHeads={tableHeads}
          data={filteredFirstTableData || []}
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
          <TableTitle content="GODIŠNJI ODMORI" variant="bodyMedium" />
          <Divider height="1px" style={{marginBottom: '30px'}} />
        </div>
        <Table
          tableHeads={tableHeads}
          data={filteredSecondTableData || []}
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

      <AbsentModal
        open={showModal}
        onClose={refetch => handleCloseModal(refetch)}
        selectedItem={selectedItem}
        userProfileId={userProfileID}
        key={selectedItem ? selectedItem.id : ''}
        alert={context.alert}
      />

      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Container>
  );
};

export default Absents;

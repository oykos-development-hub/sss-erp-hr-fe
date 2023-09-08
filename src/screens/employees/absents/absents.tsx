import {Divider, ValueType} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Dropdown, EditIconTwo, Table, TableHead, Theme, TrashIcon, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {AbsentModal} from '../../../components/absentsModal/absentsModal';
import useAbsentDelete from '../../../services/graphql/userProfile/absents/useAbsentDelete';
import useAbsentOverview from '../../../services/graphql/userProfile/absents/useAbsentOverview';
import useAbsentTypesOverview from '../../../services/graphql/userProfile/absents/useAbsentsType';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {DropdownDataString} from '../../../types/dropdownData';
import {UserProfileAbsents, UserProfileAbsentsParams} from '../../../types/graphql/profileAbsentsTypes';
import {MicroserviceProps} from '../../../types/micro-service-props';
import {parseDate} from '../../../utils/dateUtils';
import {
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
    accessor: 'absent_type',
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

const YearList: DropdownDataString[] = [
  {id: '', title: 'Sve Godine'},
  ...Array.from({length: 10}, (_, index) => {
    const year = currentYear - index;
    return {id: year.toString(), title: year.toString()};
  }),
];

const Absents: React.FC<{context: MicroserviceProps}> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {absentsData, refetchData, summary} = useAbsentOverview(userProfileID);
  const tableData = absentsData || [];
  const [firstTableData, setFirstTableData] = useState<UserProfileAbsents[]>([]);
  const [secondTableData, setSecondTableData] = useState<UserProfileAbsents[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [form, setForm] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {absentsTypeData, loading} = useAbsentTypesOverview();
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
      selectedItem?.absent_type.id || 0,
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

  const handleCloseModal = (refetch: boolean) => {
    setShowModal(false);
    setSelectedItemId(0);
    refetch && refetchData();
  };

  const handleEdit = (item: UserProfileAbsentsParams) => {
    setSelectedItemId(item?.id || 0);
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
      const filteredData = [...absentsData].filter(absent => absent?.absent_type?.accounting_days_off);
      setSecondTableData(filteredData);
      return filteredData;
    } else {
      setSecondTableData([]);
      return [];
    }
  };

  const filteredFirstTableData = useMemo(() => {
    if (form?.year?.id && form?.absent_type?.id) {
      return firstTableData.filter((item: UserProfileAbsents) => {
        return item.date_of_start.includes(form.year.id) && item.absent_type.id === form.absent_type.id;
      });
    } else if (form?.year?.id) {
      return firstTableData.filter((item: UserProfileAbsents) => item.date_of_start.includes(form.year.id));
    } else if (form?.absent_type?.id) {
      return firstTableData.filter((item: UserProfileAbsents) => item.absent_type.id === form.absent_type.id);
    }
    return firstTableData;
  }, [firstTableData, form?.year?.id, form?.absent_type?.id]);

  const filteredSecondTableData = useMemo(() => {
    if (form?.year?.id && form?.absent_type?.id) {
      return secondTableData.filter((item: UserProfileAbsents) => {
        return item.date_of_start.includes(form.year.id) && item.absent_type.id === form.absent_type.id;
      });
    } else if (form?.year?.id) {
      return secondTableData.filter((item: UserProfileAbsents) => item.date_of_start.includes(form.year.id));
    } else if (form?.absent_type?.id) {
      return secondTableData.filter((item: UserProfileAbsents) => item.absent_type.id === form.absent_type.id);
    }
    return secondTableData;
  }, [firstTableData, form?.year?.id, form?.absent_type?.id]);

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
              // @TODO remove ts-ignore
              //eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              onChange={handleChange}
            />
          </YearContainer>
          <YearContainer>
            <Dropdown
              label={<Typography variant="bodySmall" content="TIP ZAHTJEVA:" />}
              options={absentsTypeData || []}
              name="absent_type"
              value={form?.absent_type || null}
              placeholder="Odaberite tip zahtjeva:"
              // @TODO remove ts-ignore
              //eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
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
          <TableTitle content="GODIŠNJI ODMORI" variant="bodyMedium" />
          <Divider height="1px" style={{marginBottom: '30px'}} />
        </div>
        <Table
          tableHeads={tableHeads}
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

      <AbsentModal
        open={showModal}
        onClose={refetch => handleCloseModal(refetch)}
        selectedItem={selectedItem}
        userProfileId={Number(userProfileID)}
        key={selectedItem ? selectedItem.id : ''}
        alert={context.alert}
        absentTypes={absentsTypeData || []}
      />

      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Container>
  );
};

export default Absents;

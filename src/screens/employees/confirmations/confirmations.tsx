import {Typography, Button, Table, TableHead, EditIconTwo, TrashIcon, Theme, Dropdown} from 'client-library';
import {Container, TableHeader, YearWrapper} from './styles';
import React, {ReactNode, useMemo, useState} from 'react';
import {ConfirmationsModal} from '../../../components/confirmationsModal/confirmationsModal';
import {UserProfileResolutionItem} from '../../../types/graphql/userProfileGetResolution';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {MicroserviceProps} from '../../../types/micro-service-props';
import useResolutionOverview from '../../../services/graphql/userProfile/resolution/useResolutionOverview';
import useResolutionDelete from '../../../services/graphql/userProfile/resolution/useResolutionDelete';
import {parseDate} from '../../../utils/dateUtils';

interface ValueType {
  id: number | string;
  title: ReactNode;
}

const tableHeads: TableHead[] = [
  {
    title: 'Vrsta',
    accessor: 'resolution_type',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
  },
  {
    title: 'Datum izdavanja',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (date_of_start: string) => <Typography content={date_of_start ? parseDate(date_of_start) : ''} />,
  },
  {title: 'Svrha', accessor: 'resolution_purpose', type: 'text'},
  {title: 'Datoteka', accessor: 'file_id', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const currentYear = new Date().getFullYear();

const YearList: ValueType[] = Array.from({length: 10}, (_, index) => {
  const year = currentYear - index;
  return {id: year.toString(), title: year.toString()};
});

export const ConfirmationsPage: React.FC<{context: MicroserviceProps}> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {data, fetch} = useResolutionOverview(userProfileID);
  const tableData = data;

  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(
    () => tableData?.find((item: UserProfileResolutionItem) => item.id === selectedItemId),
    [selectedItemId, tableData],
  );

  const [form, setForm] = useState<any>();

  const filteredTableData = useMemo(() => {
    if (form?.year?.id) {
      return tableData?.filter((item: UserProfileResolutionItem) => item.date_of_start.includes(form.year.id));
    }
    return tableData;
  }, [tableData, form?.year?.id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {mutate} = useResolutionDelete();

  const handleChange = (value: ValueType, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (item: UserProfileResolutionItem) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDelete = () => {
    mutate(
      selectedItemId,
      () => {
        fetch();
        context.alert.success('Uspješno obrisano');
        setShowDeleteModal(false);
        setSelectedItemId(0);
      },
      () => {
        context.alert.error('Brisanje nije uspješno');
      },
    );
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleCloseModal = (refetch: boolean) => {
    setShowModal(false);
    setSelectedItemId(0);
    refetch && fetch();
  };

  return (
    <Container>
      <TableHeader>
        <YearWrapper>
          <Dropdown
            label={<Typography variant="bodySmall" content="GODINA:" />}
            options={YearList}
            name="year"
            value={form?.year || null}
            // @TODO remove ts-ignore
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            onChange={handleChange}
            placeholder="Odaberite godinu:"
          />
        </YearWrapper>
        <div>
          <Button
            variant="secondary"
            content={<Typography variant="bodyMedium" content="Dodajte svrhu" />}
            onClick={handleAdd}
          />
        </div>
      </TableHeader>

      <div>
        <Table
          tableHeads={tableHeads}
          data={filteredTableData || []}
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

      <ConfirmationsModal
        open={showModal}
        onClose={refetch => handleCloseModal(refetch)}
        selectedItem={selectedItem}
        userProfileId={userProfileID}
        key={selectedItem ? selectedItem.id : 'new'}
        alert={context.alert}
      />

      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Container>
  );
};

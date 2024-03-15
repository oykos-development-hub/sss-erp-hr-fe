import {Button, Dropdown, EditIconTwo, FileIcon, Table, Theme, TrashIcon, Typography} from 'client-library';
import {useMemo, useState} from 'react';
import {ConfirmationsModal} from '../../../components/confirmationsModal/confirmationsModal';
import FileModalView from '../../../components/fileModalView/fileModalView';
import {FileItem} from '../../../components/fileModalView/types';
import useAppContext from '../../../context/useAppContext';
import useDeleteResolution from '../../../services/graphql/userProfile/resolution/useDeleteResolution';
import useGetResolutions from '../../../services/graphql/userProfile/resolution/useGetResolutions';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ProfileResolution} from '../../../types/graphql/resolutions';
import {yearsForDropdownFilter} from '../../../utils/constants';
import {tableHeads} from './constants.tsx';
import {Container, TableHeader, YearWrapper} from './styles';

export const ConfirmationsPage = () => {
  const {
    alert,
    navigation: {location},
  } = useAppContext();
  const years = yearsForDropdownFilter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [form, setForm] = useState<any>();
  const userProfileID = location.pathname.split('/')[4];
  const {resolutions, refetch, loading} = useGetResolutions(userProfileID);
  const {deleteResolution} = useDeleteResolution();
  const tableData = resolutions;
  const [fileToView, setFileToView] = useState<FileItem>();

  const selectedItem = useMemo(
    () => tableData?.find((item: ProfileResolution) => item.id === selectedItemId),
    [selectedItemId, tableData],
  );

  const filteredTableData = useMemo(() => {
    if (form?.year?.id) {
      return tableData?.filter((item: ProfileResolution) => item.date_of_start.includes(form.year.id));
    }
    return tableData;
  }, [tableData, form?.year?.id]);

  const handleChange = (value: any, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (item: ProfileResolution) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDelete = () => {
    deleteResolution(
      selectedItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
        setShowDeleteModal(false);
        setSelectedItemId(0);
      },
      () => {
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleCloseModal = (shouldRefetch: boolean) => {
    setShowModal(false);
    setSelectedItemId(0);
    shouldRefetch && refetch();
  };

  return (
    <Container>
      <TableHeader>
        <YearWrapper>
          <Dropdown
            label={<Typography variant="bodySmall" content="GODINA:" />}
            options={years}
            name="year"
            value={form?.year || null}
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
          isLoading={loading}
          tableActions={[
            {
              name: 'showFile',
              icon: <FileIcon stroke={Theme.palette.gray600} />,
              onClick: (row: any) => {
                setFileToView(row?.file);
              },
              shouldRender: (row: any) => row?.file?.id,
            },
            {
              name: 'Izmijeni',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'Obriši',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>
      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}
      {showModal && (
        <ConfirmationsModal
          open={showModal}
          onClose={refetch => handleCloseModal(refetch)}
          selectedItem={selectedItem}
          userProfileId={userProfileID}
          key={selectedItem ? selectedItem.id : 'new'}
          alert={alert}
        />
      )}

      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
    </Container>
  );
};

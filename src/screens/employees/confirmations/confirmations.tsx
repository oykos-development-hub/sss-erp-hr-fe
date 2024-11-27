import {Button, Dropdown, EditIconTwo, FileIcon, Table, Theme, TrashIcon, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {ConfirmationsModal} from '../../../components/confirmationsModal/confirmationsModal';
import {FileItem} from '../../../components/fileModalView/types';
import useAppContext from '../../../context/useAppContext';
import useDeleteResolution from '../../../services/graphql/userProfile/resolution/useDeleteResolution';
import useGetResolutions from '../../../services/graphql/userProfile/resolution/useGetResolutions';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ProfileResolution} from '../../../types/graphql/resolutions';
import {yearsForDropdownFilter} from '../../../utils/constants';
import {tableHeads} from './constants.tsx';
import {Container, TableHeader, YearWrapper, Controls} from './styles';
import {ForeignersProps} from '../foreigners/types.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import {TemplatesModal} from '../../../components/templatesModal/templatesModal.tsx';
import MultiFileModalView from '../../../components/fileModalViewMultiple/fileModalViewMultiple.tsx';

export const ConfirmationsPage: React.FC<ForeignersProps> = ({context}) => {
  const {
    alert,
    navigation: {location},
  } = useAppContext();
  const years = yearsForDropdownFilter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [form, setForm] = useState<any>();
  const userProfileID = location.pathname.split('/')[4];
  const {resolutions, refetch, loading} = useGetResolutions(userProfileID);
  const {deleteResolution} = useDeleteResolution();
  const tableData = resolutions;
  const [filesToView, setFilesToView] = useState<FileItem[]>();
  const updatePermittedRoutes = checkActionRoutePermissions(context.contextMain?.permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/employees');

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

  const actionItems: any[] = [
    {
      name: 'showFile',
      icon: <FileIcon stroke={Theme.palette.gray600} />,
      onClick: (row: any) => {
        setFilesToView(row?.files);
      },
      shouldRender: (row: any) => row?.files?.length > 0,
    },
  ];

  if (updatePermission) {
    actionItems.push({
      name: 'Izmijeni',
      onClick: (item: any) => handleEdit(item),
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
    });
    actionItems.push({
      name: 'Obriši',
      onClick: (item: any) => handleDeleteIconClick(item.id),
      icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
    });
  }

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
        {updatePermission && (
          <Controls>
            <Button
              variant="primary"
              content={<Typography variant="bodyMedium" content="Generiši šablon" />}
              onClick={() => setShowTemplateModal(true)}
            />
            <Button
              variant="secondary"
              content={<Typography variant="bodyMedium" content="Dodajte svrhu" />}
              onClick={handleAdd}
            />
          </Controls>
        )}
      </TableHeader>

      <div>
        <Table tableHeads={tableHeads} data={filteredTableData || []} isLoading={loading} tableActions={actionItems} />
      </div>
      {filesToView && <MultiFileModalView files={filesToView} onClose={() => setFilesToView(undefined)} />}
      {showTemplateModal && (
        <TemplatesModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          userProfileId={userProfileID}
          alert={alert}
        />
      )}
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

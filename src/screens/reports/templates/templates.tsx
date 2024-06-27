import React, {useState} from 'react';
import {DownloadIcon, EditIconTwo, Table, Theme, TrashIcon, Button, Pagination} from 'client-library';
import {tableHeadsTemplates} from '../../employees/absents/constants.tsx';
import useGetTemplates from '../../../services/graphql/templates/useGetTemplates.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal.tsx';
import {useRoleCheck} from '../../../utils/useRoleCheck.ts';
import {PAGE_SIZE, UserRole} from '../../../constants.ts';
import AddTemplateModal from './addTemplateModal.tsx';
import {FileItem} from '../../../types/fileUploadType.ts';
import {Template} from '../../../types/graphql/templates.ts';
import useDeleteTemplate from '../../../services/graphql/templates/useDeleteTemplate.ts';

const Templates = () => {
  const {
    contextMain: {role_id},
    fileService: {downloadFile},
    alert,
  } = useAppContext();

  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [templateModal, setTemplateModal] = useState<Template | boolean>(false);
  const toggleTemplateModal = (template?: Template) => setTemplateModal(template ? template : false);
  const [page, setPage] = useState(1);
  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const {templates, loading, total, refetch} = useGetTemplates({page, size: PAGE_SIZE});
  const {deleteTemplate} = useDeleteTemplate();

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file.id, {
      onSuccess: () => {
        alert.success(`Fajl ${file.name} uspješno preuzet`);
      },
      onError: () => {
        alert.error('Došlo je do greške prilikom preuzimanja fajla');
      },
      fileName: file.name,
    });
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    deleteTemplate(
      deleteModal,
      () => {
        refetch();
        setDeleteModal(null);
        alert.success('Šablon uspješno obrisan.');
      },
      () => {
        alert.error('Greška pri brisanju šablona.');
      },
    );
  };
  return (
    <div style={{marginTop: 24}}>
      {useRoleCheck(role_id, [UserRole.ADMIN]) && (
        <Button
          style={{marginLeft: 'auto'}}
          variant={'primary'}
          content={'Dodaj šablon'}
          onClick={() => setTemplateModal(true)}
        />
      )}
      <Table
        tableHeads={tableHeadsTemplates}
        data={templates}
        isLoading={loading}
        maxTableActionsInRow={3}
        onRowClick={row => toggleTemplateModal(row)}
        tableActions={[
          {
            name: 'Preuzmi',
            onClick: (row: Template) => handleDownload(row?.file),
            icon: <DownloadIcon stroke={Theme?.palette?.gray800} />,
            tooltip: () => 'Preuzmi',
          },
          {
            name: 'Izmijeni',
            onClick: row => toggleTemplateModal(row),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            tooltip: () => 'Izmijeni',
          },
          {
            name: 'Obriši',
            onClick: row => setDeleteModal(row?.template.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            tooltip: () => 'Obriši',
            shouldRender: () => useRoleCheck(role_id, [UserRole.ADMIN]),
          },
        ]}
      />
      <Pagination
        pageCount={Math.ceil(total / PAGE_SIZE)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: 22}}
      />
      <ConfirmModal open={!!deleteModal} onClose={() => setDeleteModal(null)} handleConfirm={handleDelete} />
      <AddTemplateModal
        open={!!templateModal}
        onClose={() => toggleTemplateModal()}
        template={typeof templateModal !== 'boolean' ? templateModal : null}
        refetch={refetch}
      />
    </div>
  );
};

export default Templates;

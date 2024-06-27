import React, {useEffect, useState} from 'react';
import {FileUpload, Input, Modal, Typography} from 'client-library';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from '../../../components/education/modals/styles.ts';
import {useForm} from 'react-hook-form';
import useAppContext from '../../../context/useAppContext.ts';
import {Template} from '../../../types/graphql/templates.ts';
import FileListComponent from '../../../components/fileList/fileList.tsx';
import useInsertTemplate from '../../../services/graphql/templates/useInsertTemplate.ts';
import {ExistingFileWrapper, StyledLabel} from './styles.ts';
import {useRoleCheck} from '../../../utils/useRoleCheck.ts';
import {UserRole} from '../../../constants.ts';
import useUpdateTemplateAdmin from '../../../services/graphql/templates/useUpdateTemplateAdmin.ts';
import useUpdateTemplateManager from '../../../services/graphql/templates/useUpdateTemplateManager.ts';

interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  refetch: () => void;
}

const defaultValues = {
  title: '',
  file_id: 0,
};

const AddTemplateModal = ({open, onClose, template, refetch}: AddTemplateModalProps) => {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const {
    contextMain: {role_id},
    fileService: {uploadFile},
    alert,
  } = useAppContext();

  const {insertTemplate, loading: loadingInsert} = useInsertTemplate();
  const {updateTemplateAdmin, loading: loadingUpdateAdm} = useUpdateTemplateAdmin();
  const {updateTemplateManager, loading: loadingUpdateManager} = useUpdateTemplateManager();

  const loading = loadingInsert || loadingUpdateAdm || loadingUpdateManager;

  const handleFileUpload = (files: FileList) => {
    setFiles(files);
    alert.success('Fajl uspješno učitan');
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
    reset,
  } = useForm({defaultValues});

  const handleCloseModal = () => {
    reset();
    setFiles(undefined);
    onClose();
  };

  useEffect(() => {
    setValue('title', template ? template?.template?.title : '');
  }, [template]);

  const isNew = !template;
  const isAdminEdit = !isNew && useRoleCheck(role_id, [UserRole.ADMIN]);
  const isManagerEdit = !isNew && useRoleCheck(role_id, [UserRole.MANAGER_OJ]);

  const onSubmit = async (data: any) => {
    // Admin can create new template
    if (isNew && useRoleCheck(role_id, [UserRole.ADMIN])) {
      if (!files) return;
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(undefined);
          const updatedData = {...data, file_id: res[0]?.id};
          insertTemplate(
            updatedData,
            () => {
              refetch();
              handleCloseModal();
              alert.success('Šablon uspješno sačuvan.');
            },
            () => {
              alert.error('Greška pri čuvanju šablona.');
            },
          );
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    }
    // Admin can edit template by changing its name but not the file
    if (isAdminEdit) {
      updateTemplateAdmin(
        {title: data.title, id: template?.template?.id},
        () => {
          refetch();
          handleCloseModal();
          alert.success('Šablon uspješno preimenovan.');
        },
        () => {
          alert.error('Greška pri promjeni naziva šablona.');
        },
      );
    }
    // Manager can edit template by changing the file but not the name
    if (isManagerEdit) {
      if (!files) return;
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(undefined);
          const updatedData = {
            file_id: res[0]?.id,
            organization_unit_id: template?.organization_unit.id,
            template_id: template?.template.id,
            id: template?.id,
          };
          updateTemplateManager(
            updatedData,
            () => {
              refetch();
              handleCloseModal();
              alert.success('Šablon uspješno izmijenjen.');
            },
            () => {
              alert.error('Greška pri izmjeni šablona.');
            },
          );
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      title={isNew ? 'Dodaj šablon' : 'Izmijeni šablon'}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={loading}
      content={
        <ModalContentWrapper>
          <FormGroup>
            {!isManagerEdit && (
              <Input
                {...register('title', {required: 'Ovo polje je obavezno'})}
                label="Naziv:"
                error={errors.title?.message as string}
                isRequired
              />
            )}
          </FormGroup>

          <FormGroup>
            {!isAdminEdit && (
              <FileUploadWrapper>
                <FileUpload
                  icon={<></>}
                  style={{width: '100%'}}
                  variant="secondary"
                  onUpload={handleFileUpload}
                  note={<Typography variant="bodySmall" content="Šablon" />}
                  buttonText="Učitaj"
                  files={files}
                />
              </FileUploadWrapper>
            )}
            {!!template?.file && (
              <ExistingFileWrapper>
                <StyledLabel variant="bodyMedium" content="Fajl: " />
                <FileListComponent files={(template?.file && [template.file]) ?? []} />
              </ExistingFileWrapper>
            )}
          </FormGroup>
        </ModalContentWrapper>
      }
    />
  );
};

export default AddTemplateModal;

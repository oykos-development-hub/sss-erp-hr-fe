import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {quarterOptions} from '../../constants';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useGetRevisions from '../../services/graphql/revision/useGetRevisions';
import useGetRevisionDetails from '../../services/graphql/revision/useGetRevisionDetails';
import useInsertRevision from '../../services/graphql/revision/useInsertRevisions';
import useGetSettings from '../../services/graphql/settings/useGetSettings';
import useGetSuppliers from '../../services/graphql/suppliers/useGetSuppliers';
import {revisionInsertItem} from '../../types/graphql/revisionInsert';
import {FormGroupFullWidth} from '../revisionTipsModal/styles';
import {Column, FileUploadWrapper, FormGroup, ModalForm, ModalSection, Row} from './styles';
import useAppContext from '../../context/useAppContext';
import FileList from '../fileList/fileList.tsx';
import { FileItem } from '../../types/fileUploadType.ts';
import * as yup from 'yup';
import { parseDateForBackend } from '../../utils/dateUtils.ts';

interface RevisionModalProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
  planId: number;
}

const confirmationSchema = yup.object().shape({
  id: yup.number().default(undefined).optional(),
  title: yup.string().required('Ovo polje je obavezno').default(undefined),
  serial_number: yup.string().required('Ovo polje je obavezno').default(undefined),
  plan_id: yup.number().required('Ovo polje je obavezno').default(undefined),
  date_of_revision: yup.date().required('Ovo polje je obavezno').default(undefined),
  revisor_id: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.number().required(),
        label: yup.string().required(),
      })
    )
    .min(1, 'Obavezno polje')
    .default([])
    .required('Ovo polje je obavezno'),
  revision_quartal: yup.object().shape({
    id: yup.string().required(),
    title: yup.string().required(),
  }).default(undefined).required('Ovo polje je obavezno'),
  revision_type_id: yup.object().shape({
    id: yup.number().required(),
    title: yup.string().required(),
  }).default(undefined).required('Ovo polje je obavezno'),
  internal_revision_subject_id: yup.array()
    .of(
      yup.object().shape({
        value: yup.number(),
        label: yup.string().required(),
      })
    )
    .default([]),
  external_revision_subject_id: yup.object().shape({
    id: yup.number().required(),
    title: yup.string().required(),
  })
    .default(undefined)
    .optional(),
}).test(
  'at-least-one',
  'Jedno od polja `internal_revision_subject_id` ili `external_revision_subject_id` mora biti popunjeno',
  function (values) {
    if (
      (!values.internal_revision_subject_id || values.internal_revision_subject_id.length === 0) &&
      !values.external_revision_subject_id
    ) {
      return this.createError({ path: 'internal_revision_subject_id', message: 'Jedno od polja mora biti popunjeno' });
    }
    return true;
  }
);

export const RevisionModal: React.FC<RevisionModalProps> = ({open, onClose, alert, refetchList, id, planId}) => {
  const {revisionDetails, loading} = useGetRevisionDetails(id);
  const {insertRevision, loading: isSaving} = useInsertRevision();
  const {suppliers, loading: loadingSuppliers} = useGetSuppliers();
  const {organizationUnits} = useGetOrganizationUnits(undefined);
  const {revisions} = useGetRevisions({
    page: 1,
    size: 1000,
    plan_id: planId,
    internal_revision_subject_id: 0,
    revision_type_id: 0,
    revisor_id: 0,
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [initialFiles, setInitialFiles] = useState<FileItem[]>([]);

  const {
    fileService: {uploadFile, deleteFile},
  } = useAppContext();

  const {settingsData} = useGetSettings({entity: 'revision_types'});

  const revisionsList = settingsData?.map(setting => {
    return {
      id: setting.id,
      title: setting.title,
    };
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(confirmationSchema),
  });

  const handleInsertRevision = (data: any) => {
    insertRevision(
      data,
      () => {
        refetchList();
        onClose();
        reset();
        alert.success(revisionDetails?.id ? 'Revizija uspješno sačuvan.' : 'Revizija je uspešno dodat.');
      },
      () => {
        alert.error(
          revisionDetails?.id
            ? 'Došlo je do greške prilikom izmjene revizije.'
            : 'Došlo je do greške prilikom dodavanja revizije.',
        );
      },
    );
  };

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    const data: revisionInsertItem = {
      id: values?.id || 0,
      title: values.title,
      plan_id: values.plan_id,
      serial_number: values.serial_number ,
      date_of_revision: parseDateForBackend(values.date_of_revision) || '',
      revision_quartal: values.revision_quartal.id,
      internal_revision_subject_id: values?.internal_revision_subject_id?.map((item: any) => item.value),
      external_revision_subject_id: values?.external_revision_subject_id?.id || null,
      revisor_id: values?.revisor_id?.map((item: any) => item.value),
      revision_type_id: values?.revision_type_id.id || null,
      file_ids: initialFiles.map(file => file.id)
    };

    const hasFiles = (files?.length && files.length > 0);

    if (hasFiles) {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const formData = new FormData();

        formData.append('file', file);

        await uploadFile(
          formData,
          (res: any) => {
            data.file_ids.push(res[0]?.id);
            setFiles(null);
          },
          () => {
            alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
          },
        );
      }
    }

    handleInsertRevision(data);

    deleteFiles();
  };

  const internalSubject = watch('internal_revision_subject_id');
  const externalSubject = watch('external_revision_subject_id');

  useEffect(() => {
    if (internalSubject && internalSubject.length > 0) {
      clearErrors('external_revision_subject_id');
      setValue('external_revision_subject_id', undefined);
    }
  }, [internalSubject]);

  useEffect(() => {
    if (externalSubject) {
      clearErrors('internal_revision_subject_id');
      setValue('internal_revision_subject_id', []);
    }
  }, [externalSubject, setValue]);

  useEffect(() => {
    if (revisionDetails && id && !loading && !loadingSuppliers) {
      reset({
        id: revisionDetails.id,
        title: revisionDetails.title,
        plan_id: revisionDetails.plan_id,
        serial_number: revisionDetails.serial_number,
        date_of_revision: new Date(revisionDetails.date_of_revision),
        revision_quartal: quarterOptions.find(
          (quarterOptions: any) => quarterOptions.id === revisionDetails.revision_quartal,
        ),
        internal_revision_subject_id: revisionDetails.internal_revision_subject?.map((item: any) => ({
          value: item.id,
          label: item.title,
        })),
        external_revision_subject_id: suppliers.find(
          (supplier) => supplier.id === revisionDetails.external_revision_subject?.id,
        ),
        revisor_id: revisionDetails.revisor?.map((item: any) => ({
          value: item.id,
          label: item.title,
        })),
        revision_type_id: revisionDetails.revision_type ?? undefined
      });

      setInitialFiles(revisionDetails.files);
    }

    setValue('plan_id', planId);
  }, [revisionDetails, suppliers]);

  const onFileRemove = (id: number) => {
    setInitialFiles(files => files.filter(file => file.id !== id));
  };

  const deleteFiles = async () => {
    for (const file of revisionDetails?.files || []) {
      const fileDeleted = !initialFiles.some(file2 => file2.id === file.id);
      if (fileDeleted) {
        await deleteFile(
          file.id, 
        );
      }
    }
  };

  const handleFileUpload = (files: FileList) => {
    setFiles(files);
    
    alert.success('Fajlovi uspješno učitani');
  };

  return (
    <Modal
      onClose={() => onClose()}
      open={open}
      title={'DODAJTE REVIZIJU'}
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      width={650}
      content={
        <ModalForm>
          <ModalSection>
            <Row>
              <FormGroup>
                <Input
                  {...register('title', {required: 'Ovo polje je obavezno'})}
                  label="NAZIV REVIZIJE"
                  placeholder="Unesite naziv"
                  isRequired
                  error={errors.title?.message as string}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  {...register('serial_number', {required: 'Ovo polje je obavezno'})}
                  label="BROJ REVIZIJE"
                  placeholder="Unesite broj"
                  isRequired
                  error={errors.title?.message as string}
                />
              </FormGroup>
            </Row>

            <Column>
              <FormGroup>
                <Controller
                  control={control}
                  name="internal_revision_subject_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={organizationUnits}
                      error={errors.internal_revision_subject_id?.message as string}
                      placeholder="Izaberite subjekt"
                      label="SUBJEKT REVIZIJE (interna):"
                      isRequired
                      isMulti
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="external_revision_subject_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={suppliers}
                      error={errors.external_revision_subject_id?.message as string}
                      placeholder="Izaberite subjekt"
                      isRequired
                      label="SUBJEKT REVIZIJE (eksterna):"
                    />
                  )}
                />
              </FormGroup>
            </Column>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="revisor_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisions?.revisors}
                      error={errors.revisor_id?.message as string}
                      placeholder="Izaberite revizora"
                      label="REVIZOR"
                      isRequired
                      isMulti
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="revision_type_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={revisionsList || []}
                      error={errors.revision_type_id?.message as string}
                      isRequired
                      placeholder="Izaberite vrstu revizije"
                      label="VRSTA REVIZIJE"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  name="date_of_revision"
                  control={control}
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM REVIZIJE:"
                      name={name}
                      selected={value}
                      isRequired
                      error={errors.date_of_revision?.message as string}
                    />
                  )}
                />
              </FormGroup>
              <FormGroupFullWidth>
                <Controller
                  control={control}
                  name="revision_quartal"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={quarterOptions}
                      error={errors.revision_quartal?.message as string}
                      placeholder="Izaberite kvartal"
                      isRequired
                      label="KVARTAL ZA SPROVOĐENJE REVIZIJE:"
                    />
                  )}
                />
              </FormGroupFullWidth>
            </Row>
          </ModalSection>
          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={handleFileUpload}
              note={<Typography variant="bodySmall" content="Upload dokumenta" />}
              buttonText="Učitaj"
              multiple={true}
            />
            {initialFiles && (
              <FileList onDelete={onFileRemove} files={initialFiles} />
            )}
          </FileUploadWrapper>
        </ModalForm>
      }
    />
  );
};

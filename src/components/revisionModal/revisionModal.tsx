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
import {RevisionFormValues} from '../../types/graphql/revisions';
import useAppContext from '../../context/useAppContext';

interface RevisionModalProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
  planId: number;
}

const initialValues: RevisionFormValues = {
  id: null,
  title: '',
  plan_id: 0,
  serial_number: '',
  date_of_revision: '',
  revision_priority: '',
  revision_quartal: null,
  internal_revision_subject_id: [],
  external_revision_subject_id: null,
  revisor_id: [],
  revision_type_id: null,
};

export const RevisionModal: React.FC<RevisionModalProps> = ({open, onClose, alert, refetchList, id, planId}) => {
  const {revisionDetails} = useGetRevisionDetails(id);
  const {insertRevision, loading: isSaving} = useInsertRevision();
  const {suppliers} = useGetSuppliers();
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
  const {
    fileService: {uploadFile},
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
  } = useForm<RevisionFormValues>({defaultValues: initialValues});

  const handleInsertRevision = (data: any) => {
    insertRevision(
      data,
      () => {
        refetchList();
        onClose();
        reset(initialValues);
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
      id: values?.id,
      title: values?.title || null,
      plan_id: planId,
      serial_number: values?.serial_number || null,
      date_of_revision: values?.date_of_revision || null,
      revision_quartal: values?.revision_quartal.id || null,
      internal_revision_subject_id: values?.internal_revision_subject_id?.map((item: any) => item.value),
      external_revision_subject_id: values?.external_revision_subject_id?.id || null,
      revisor_id: values?.revisor_id?.map((item: any) => item.value),
      revision_type_id: values?.revision_type_id.id || null,
    };

    if (files) {
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(null);
          const updatedData = {...data, file_id: res[0]?.id};
          handleInsertRevision(updatedData);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      handleInsertRevision(data);
    }
  };

  const internalSubject = watch('internal_revision_subject_id');
  const externalSubject = watch('external_revision_subject_id');

  useEffect(() => {
    if (internalSubject) {
      setValue('external_revision_subject_id', null);
    }
  }, [internalSubject, setValue]);

  useEffect(() => {
    if (externalSubject) {
      setValue('internal_revision_subject_id', []);
    }
  }, [externalSubject, setValue]);

  useEffect(() => {
    if (revisionDetails && revisionDetails && id) {
      reset({
        id: revisionDetails.id,
        title: revisionDetails.title,
        plan_id: revisionDetails.plan_id,
        serial_number: revisionDetails.serial_number,
        date_of_revision: revisionDetails.date_of_revision,
        revision_quartal: quarterOptions.find(
          (quarterOptions: any) => quarterOptions.id === revisionDetails.revision_quartal,
        ),
        internal_revision_subject_id: revisionDetails.internal_revision_subject?.map((item: any) => ({
          value: item.id,
          label: item.title,
        })),
        external_revision_subject_id: suppliers.find(
          (suppliers: any) => suppliers.id === revisionDetails.external_revision_subject?.id,
        ),
        revisor_id: revisionDetails.revisor?.map((item: any) => ({
          value: item.id,
          label: item.title,
        })),
        revision_type_id: revisionsList?.find(
          (revisionsList: any) => revisionsList.title === revisionDetails.revision_type?.title,
        ),
      });
    }
  }, [revisionDetails]);

  const handleUpload = (files: FileList) => {
    setFiles(files);
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
                      selected={value ? new Date(value) : ''}
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
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Upload dokumenta" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </ModalForm>
      }
    />
  );
};

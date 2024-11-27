import {Dropdown, FileUpload, Input, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {requiredError, revisionDeadlineOptions, revisionPriorityOptions, revisionStatusOptions} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {
  FileUploadWrapper,
  FormGroup,
  FormGroupFullWidth,
  ModalForm,
  ModalSection,
  ModalSectionTitle,
  RevisionModal,
  Row,
} from './styles';
import { FileItem } from '../../types/fileUploadType';
import FileList from '../fileList/fileList';
import useInsertRevisionTipImplementation from '../../services/graphql/revisionTipImplementation/useRevisionTipImplementationInsert';
import { RevisionTip, RevisionTipImplementation } from '../../types/graphql/revisionTips';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { dropdownNumberSchema, dropdownStringSchema } from '../../screens/employees/basicInfo/constants';
import { Button } from 'client-library';
import { ConfirmModalButtons } from '../JobTenderApplicationModal/styles';

interface RevisionTipImplementationModalProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
  tipID: number;
  revisors: DropdownDataNumber[];
  item?: RevisionTipImplementation;
  revisionTip: RevisionTip;
}

const confirmationSchema = yup.object().shape({
  id: yup.number(),
  revisor_id: yup.object(dropdownNumberSchema)
    .when('status', {
      is: (status: DropdownDataString) => status?.title === 'Sprovedena', 
      then: schema => schema.required(requiredError),
      otherwise: schema => schema.optional(),
    }).default(undefined),
  status: yup.object(dropdownStringSchema).required(requiredError).default(undefined),
  new_due_date: yup.object(dropdownNumberSchema)
    .when('status', {
      is: (status: DropdownDataString) => status?.title === 'Nesprovedena', 
      then: schema => schema.required(requiredError),
      otherwise: schema => schema.optional(),
    }).default(undefined),
  reasons_for_non_executing: yup.string()
    .when('status', {
      is: (status: DropdownDataString) => status?.title === 'Nesprovedena', 
      then: schema => schema.required(requiredError),
      otherwise: schema => schema.optional(),
    }).default(undefined),
  new_date_of_execution: yup.string(),
  documents: yup.string(),
});


export const RevisionTipImplementationModal: React.FC<RevisionTipImplementationModalProps> = ({
  open,
  onClose,
  alert,
  refetchList,
  id,
  tipID,
  revisors,
  item,
  revisionTip,
}) => {
  const {insertRevisionTipImplementation, loading: isSaving} = useInsertRevisionTipImplementation();
  const [secondDateOfImplementation, setSecondDateOfImplementation] = useState<Date | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [initialFiles, setInitialFiles] = useState<FileItem[]>([]);

  const {
    fileService: {uploadFile, deleteFile},
  } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
    watch,
  } = useForm({resolver: yupResolver(confirmationSchema)});

  const newDeadline = watch('new_due_date');

  const revisionStatusConducted = watch('status')?.id === 'Sprovedena';

  const handleFileUpload = (files: FileList) => {
    setFiles(files);

    alert.success('Fajlovi uspješno učitani');
  };

  const onFileRemove = (id: number) => {
    setInitialFiles(files => files.filter(file => file.id !== id));
  };

  const deleteFiles = async () => {
    for (const file of (item?.files) || []) {
      const fileDeleted = !initialFiles.some(file2 => file2.id === file.id);
      if (fileDeleted) {
        await deleteFile(
          file.id, 
        );
      }
    }
  };

  const handleInsertRevisionTipImplementation = (data: any) => {
    insertRevisionTipImplementation(
      data,
      () => {
        refetchList();
        onClose();
        reset();
        alert.success(item?.id ? 'Preporuka uspješno sačuvana.' : 'Preporuka je uspešno dodata.');
      },
      () => {
        alert.error(
          item?.id
            ? 'Došlo je do greške prilikom izmjene preporuke.'
            : 'Došlo je do greške prilikom dodavanja preporuke.',
        );
      },
    );
  };

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    const data = {
      id: values.id,
      tip_id: tipID,
      status: values.status.title,
      new_due_date: values?.new_due_date?.id || null,
      new_date_of_execution: parseDateForBackend(values?.new_date_of_execution) ?? undefined,
      reasons_for_non_executing: values.reasons_for_non_executing,
      revisor_id: values?.revisor_id?.id || null,
      documents: values.documents,
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
          },
          () => {
            alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
          },
        );
      }

      setFiles(null);
    }
    
    handleInsertRevisionTipImplementation(data);

    deleteFiles();
  };

  useEffect(() => {
    if (item) {
      reset({
        id: id,
        status: revisionStatusOptions.find(val => val.title === item?.status),
        revisor_id: revisors.find(val => val.id === item?.revisor.id),
        new_due_date: revisionDeadlineOptions.find(val => val.id === item?.new_due_date),
        documents:  item?.documents,
        new_date_of_execution: item?.new_date_of_execution,
        reasons_for_non_executing: item?.reasons_for_non_executing,
      });

      setInitialFiles(item?.files || []);
    }
  }, [item]);

  const calculateDateOfImplementation = (revisionDate: Date, monthSpan: number | null) => {
    const parsedDateOfRevision = new Date(revisionDate);
    const monthsToAdd = Number(monthSpan);
    parsedDateOfRevision.setMonth(parsedDateOfRevision.getMonth() + monthsToAdd);
    return parsedDateOfRevision;
  };


  useEffect(() => {
    if (newDeadline) {
      const currentDate = new Date();
      const formattedSecondDate = calculateDateOfImplementation(currentDate, newDeadline.id);
      setSecondDateOfImplementation(formattedSecondDate);
    }
      
  }, [newDeadline]);

  const buttonControls = (
    <ConfirmModalButtons>
      <Button disabled={revisionTip.status === 'Sprovedena'} content="Sačuvaj" onClick={handleSubmit(onSubmit)} variant="primary" />
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
    </ConfirmModalButtons>
  );

  return (
    <RevisionModal
      onClose={() => onClose()}
      open={open}
      title={'SPROVOĐENJE PREPORUKE'}
      buttonLoading={isSaving}
      customButtonsControls={buttonControls}
      disabledControls={revisionTip.status === 'Sprovedena'}
      content={
        <ModalForm>
          <ModalSection>
            <ModalSectionTitle content="SPROVOĐENJE PREPORUKE REVIZIJE:" variant="bodyMedium" />
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="status"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={revisionStatusOptions}
                      label="STATUS SPROVOĐENJA:"
                      error={errors.status?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Input {...register('documents')} label="REF. DOKUMENTA:" />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="revisor_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={revisors || []}
                      placeholder="Izaberite revizora"
                      label="IMPLEMENTACIJU PREPORUKE POTVRDIO:"
                      isDisabled={!revisionStatusConducted}
                      error={errors.revisor_id?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="new_due_date"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={revisionDeadlineOptions}
                      label="NOVI ROK SPROVOĐENJA PREPORUKE:"
                      isDisabled={revisionStatusConducted}
                      error={errors.new_due_date?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Input
                  {...register('new_date_of_execution')}
                  label="NOVI DATUM:"
                  value={secondDateOfImplementation ? parseDate(secondDateOfImplementation) : ''}
                  disabled
                />
              </FormGroup>
            </Row>
            <FormGroupFullWidth>
              <Input
                {...register('reasons_for_non_executing')}
                label="RAZLOZI NESPROVOĐENJA:"
                disabled={revisionStatusConducted}
                error={errors.reasons_for_non_executing?.message}
              />
            </FormGroupFullWidth>
              
            <FileUploadWrapper>
              <FileUpload
                icon={<></>}
                style={{width: '100%'}}
                variant="secondary"
                onUpload={handleFileUpload}
                files={files}
                multiple={true}
                note={<Typography variant="bodySmall" content="Upload dokumenta" />}
                buttonText="Učitaj"
              />
            </FileUploadWrapper>
            {initialFiles && (
              <FileList onDelete={onFileRemove} files={initialFiles} />
            )}
          </ModalSection>
        </ModalForm>
      }
    />
  );
};

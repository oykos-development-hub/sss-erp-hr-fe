import {Datepicker, Dropdown, FileUpload, Input, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {revisionDeadlineOptions, revisionPriorityOptions, revisionStatusOptions} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useGetRevisionTipDetails from '../../services/graphql/revisionTips/useRevisionTipsDetails';
import useInsertRevisionTip from '../../services/graphql/revisionTips/useRevisionTipsInsert';
import useGetRevisionTips from '../../services/graphql/revisionTips/useRevisionTipsOverview';
import {DropdownDataString} from '../../types/dropdownData';
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

interface RevisionTipModalProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
  revisionId: number;
}

const initialValues: any = {
  user_profile_id: null,
  date_of_accept: null,
  due_date: null,
  date_of_reject: null,
  date_of_execution: null,
  recommendation: '',
  revision_priority: '',
};

export const RevisionTipsModal: React.FC<RevisionTipModalProps> = ({
  open,
  onClose,
  alert,
  refetchList,
  id,
  revisionId,
}) => {
  const {revisionTipDetails} = useGetRevisionTipDetails(id);
  const {insertRevisionTip, loading: isSaving} = useInsertRevisionTip();
  const {revisionTips} = useGetRevisionTips({page: 1, size: 1000, revision_id: revisionId});
  const [dateOfImplementation, setDateOfImplementation] = useState<any>();
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
  } = useForm({defaultValues: initialValues});

  const implementationMonthSpan = watch('due_date');
  const dateOfAccept = watch('date_of_accept');

  const handleFileUpload = (files: FileList) => {
    setFiles(files);

    alert.success('Fajlovi uspješno učitani');
  };

  const onFileRemove = (id: number) => {
    setInitialFiles(files => files.filter(file => file.id !== id));
  };

  const deleteFiles = async () => {
    for (const file of (revisionTipDetails?.files) || []) {
      const fileDeleted = !initialFiles.some(file2 => file2.id === file.id);
      if (fileDeleted) {
        await deleteFile(
          file.id, 
        );
      }
    }
  };

  const handleInsertRevisionTips = (data: any) => {
    insertRevisionTip(
      data,
      () => {
        refetchList();
        onClose();
        reset(initialValues);
        alert.success(revisionTipDetails?.id ? 'Preporuka uspješno sačuvana.' : 'Preporuka je uspešno dodata.');
      },
      () => {
        alert.error(
          revisionTipDetails?.id
            ? 'Došlo je do greške prilikom izmjene preporuke.'
            : 'Došlo je do greške prilikom dodavanja preporuke.',
        );
      },
    );
  };

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    const data = {
      ...values,
      responsible_person: values?.responsible_person || '',
      date_of_accept: parseDateForBackend(values?.date_of_accept) ?? undefined,
      due_date: values?.due_date.id ?? undefined,
      date_of_reject: parseDateForBackend(values?.date_of_reject) ?? undefined,
      date_of_execution: parseDateForBackend(dateOfImplementation) ?? undefined,
      recommendation: values?.recommendation || '',
      revision_id: revisionId,
      status: values.status?.id || '',
      user_profile_id: values?.user_profile_id?.id || null,
      revision_priority: values?.revision_priority.id || null,
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
    
    handleInsertRevisionTips(data);

    deleteFiles();
  };

  useEffect(() => {
    if (revisionTipDetails && id) {
      reset({
        id: id,
        responsible_person: revisionTipDetails.responsible_person,
        date_of_accept: revisionTipDetails.date_of_accept,
        due_date: revisionDeadlineOptions.find(
          (revisionDeadlineOptions: any) => revisionDeadlineOptions.id === revisionTipDetails.due_date,
        ),
        date_of_reject: revisionTipDetails.date_of_reject,
        date_of_execution: revisionTipDetails.date_of_execution,
        recommendation: revisionTipDetails.recommendation,
        revision_id: revisionTipDetails.revision_id,
        status: revisionStatusOptions.find(
          (revisionStatusOptions: any) => revisionStatusOptions.id === revisionTipDetails.status,
        ),
        user_profile_id: revisionTips.revisors.find(
          (revisorsList: any) => revisorsList.id === revisionTipDetails.user_profile.id,
        ),
        revision_priority: revisionPriorityOptions.find(
          (revisionPriorityOptions: any) => revisionPriorityOptions.id === revisionTipDetails.revision_priority,
        ),
      });

      setInitialFiles(revisionTipDetails.files);
    }
  }, [revisionTipDetails]);

  const calculateDateOfImplementation = (revisionDate: Date, monthSpan: DropdownDataString | null) => {
    const parsedDateOfRevision = new Date(revisionDate);
    const monthsToAdd = Number(monthSpan);
    parsedDateOfRevision.setMonth(parsedDateOfRevision.getMonth() + monthsToAdd);
    return parsedDateOfRevision;
  };

  useEffect(() => {
    if (dateOfAccept && implementationMonthSpan) {
      const formattedDate = calculateDateOfImplementation(dateOfAccept, implementationMonthSpan.id);
      setDateOfImplementation(formattedDate);
    }

  }, [dateOfAccept, implementationMonthSpan]);

  return (
    <RevisionModal
      onClose={() => onClose()}
      open={open}
      title={'PREPORUKE'}
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      content={
        <ModalForm>
          <ModalSection>
            <ModalSectionTitle content="PREPORUKE REVIZIJE:" variant="bodyMedium" />
            <Row>
              <FormGroup>
                <Input
                  {...register('responsible_person', {
                    required: 'Ovo polje je obavezno',
                  })}
                  error={errors.responsible_person?.message as string}
                  placeholder="Unesite odgovorno lice"
                  label="ODGOVORNO LICE ZA SPROVOĐENJE PREPORUKE:"
                  isRequired
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  name="date_of_accept"
                  rules={{required: 'Ovo polje je obavezno'}}
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM PRIHVATANJA AKCIONOG PLANA:"
                      name={name}
                      selected={value ? new Date(value) : ''}
                      isRequired
                      error={errors.date_of_accept?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="due_date"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={revisionDeadlineOptions}
                      error={errors.due_date?.message as string}
                      placeholder="Izaberite rok"
                      label="ROK SPROVOĐENJA PREPORUKE:"
                      isRequired
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="revision_priority"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={revisionPriorityOptions}
                      error={errors.revision_priority?.message as string}
                      isRequired
                      placeholder="Izaberite prioritet preporuke"
                      label="PRIORITET PREPORUKE:"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Input
                  {...register('date_of_execution')}
                  label="DATUM SPROVOĐENJA PREPORUKE:"
                  value={dateOfImplementation && parseDate(dateOfImplementation)}
                  disabled
                />
              </FormGroup>
              {id > 0 && (
                <FormGroup>
                  <Input
                    {...register('date_of_reject')}
                    label="DATUM NEPRIHVATANJA PREPORUKE:"
                    disabled
                  />
                </FormGroup>
              )}
            </Row>

            <FormGroupFullWidth>
              <Input
                {...register('recommendation', {
                  required: 'Ovo polje je obavezno',
                })}
                textarea
                label="PREPORUKA:"
                placeholder="Unesite preporuku"
                isRequired
                error={errors.recommendation?.message as string}
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

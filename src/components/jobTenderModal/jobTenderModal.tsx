import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useInsertJobTender from '../../services/graphql/jobTenders/useInsertJobTender';
import {JobTendersModalProps} from '../../types/graphql/jobTenders';
import {FileUploadWrapper, ModalContentWrapper, Row} from '../education/modals/styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import useAppContext from '../../context/useAppContext';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import FileList from '../fileList/fileList.tsx';

const jobTenderSchema = yup.object().shape({
  type: yup
    .object()
    .default(undefined)
    .shape({id: yup.number(), title: yup.string()})
    .required('Ovo polje je obavezno'),
  organization_unit_id: yup
    .object()
    .default(undefined)
    .shape({id: yup.string(), title: yup.string()})
    .required('Ovo polje je obavezno'),
  date_of_start: yup.date().required('Ovo polje je obavezno'),
  date_of_end: yup
    .date()
    .required('Ovo polje je obavezno')
    .min(yup.ref('date_of_start'), 'Datum mora biti veći od datuma početka'),
  serial_number: yup.string().required('Ovo polje je obavezno'),
  id: yup.number(),
  number_of_vacant_seats: yup.number().nullable(),
});

const initialValues = {
  id: 0,
  organization_unit_id: undefined,
  date_of_start: undefined,
  date_of_end: undefined,
  serial_number: '',
  type: undefined,
  description: '',
  file_id: 0,
  number_of_vacant_seats: 0,
};

export const JobTenderModal: React.FC<JobTendersModalProps> = ({
  selectedItem,
  open,
  onClose,
  jobTenderTypeOptions,
  alert,
  refetch,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
    setValue,
  } = useForm({resolver: yupResolver(jobTenderSchema)});

  const {type} = watch();

  // has_president is false, because we need OJ that do not have a president

  const {organizationUnits: organizationUnitsList} = useGetOrganizationUnits(
    {has_president: type?.title === 'Javni oglas za predsjednika suda' ? false : null},
    {allOption: true},
  );

  const {insertJobTender, loading: isSaving} = useInsertJobTender();
  const [files, setFiles] = useState<FileList | null>(null);
  const {
    fileService: {uploadFile},
  } = useAppContext();

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem.date_of_end),
        date_of_start: parseToDate(selectedItem.date_of_start),
        organization_unit_id: selectedItem.organization_unit,
      });
    }
  }, [selectedItem]);

  const isNumOfVacantSeatsDisabled = type?.title === 'Javni oglas za predsjednika suda';

  useEffect(() => {
    if (isNumOfVacantSeatsDisabled) {
      setValue('number_of_vacant_seats', null);
    }
  }, [type]);

  const handleInsertJobTender = async (data: any) => {
    insertJobTender(
      data,
      () => {
        alert.success('Uspješno sačuvano.');
        refetch();
        onClose();
        reset(initialValues);
      },
      () => {
        alert.success('Uspješno sačuvano.');
      },
    );
  };

  const onSubmit = async (values: any) => {
    if (isSaving) return;
    const numberOfVacant = !values?.number_of_vacant_seats ? 1 : values?.number_of_vacant_seats;
    const payload = {
      id: values.id,
      organization_unit_id: values?.organization_unit_id?.id,
      type: values?.type?.id,
      description: '',
      serial_number: values.serial_number,
      date_of_start: parseDateForBackend(values?.date_of_start),
      date_of_end: parseDateForBackend(values?.date_of_end),
      number_of_vacant_seats: numberOfVacant,
    };

    if (files) {
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(null);
          const updatedData = {...payload, file_id: res[0]?.id};
          handleInsertJobTender(updatedData);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      const fileId = selectedItem?.file && selectedItem?.file?.id ? selectedItem?.file?.id : 0;
      handleInsertJobTender({...payload, file_id: fileId});
    }
  };

  const handleUpload = (files: FileList) => {
    setFiles(files);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(initialValues);
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <Row>
            <Controller
              name="type"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="TIP OGLASA:"
                  name={name}
                  options={jobTenderTypeOptions}
                  value={value as any}
                  onChange={onChange}
                  isRequired
                  error={errors.type?.message}
                />
              )}
            />
            <Controller
              name="organization_unit_id"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA:"
                  name={name}
                  options={organizationUnitsList.slice(1)}
                  value={value as any}
                  onChange={onChange}
                  isRequired
                  error={errors.organization_unit_id?.message}
                />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="date_of_start"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM OBJAVE:"
                  name={name}
                  selected={value}
                  isRequired
                  error={errors.date_of_start?.message}
                />
              )}
            />
            <Controller
              name="date_of_end"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="OGLAS JE VALIDAN DO:"
                  name={name}
                  selected={value}
                  isRequired
                  error={errors.date_of_end?.message}
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('serial_number')}
              label="BROJ OGLASA:"
              error={errors.serial_number?.message}
              isRequired
            />
            <Input
              {...register('number_of_vacant_seats')}
              label="BROJ UPRAŽNJENIH MJESTA:"
              type="number"
              value={watch('number_of_vacant_seats')?.toString()}
              disabled={isNumOfVacantSeatsDisabled}
            />
          </Row>
          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Dokument oglasa" />}
              buttonText="Učitaj"
              multiple={true}
            />
            {selectedItem?.file?.id !== 0 && <FileList files={(selectedItem?.file && [selectedItem?.file]) ?? []} />}
          </FileUploadWrapper>
        </ModalContentWrapper>
      }
      title={selectedItem?.id ? 'IZMJENITE OGLAS' : 'DODAJTE NOVI OGLAS'}
    />
  );
};

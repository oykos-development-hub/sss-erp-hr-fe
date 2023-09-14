import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useJobTenderInsert from '../../services/graphql/jobTenders/useJobTenderInsert';
import {JobTendersModalProps} from '../../types/graphql/jobTenders';
import {FileUploadWrapper, ModalContentWrapper, Row} from '../education/modals/styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

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
};

export const JobTenderModal: React.FC<JobTendersModalProps> = ({
  selectedItem,
  open,
  onClose,
  organizationUnitsList,
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
  } = useForm({resolver: yupResolver(jobTenderSchema)});

  const {mutate, loading: isSaving} = useJobTenderInsert();

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem.date_of_end),
        date_of_start: parseToDate(selectedItem.date_of_start),
        organization_unit_id: organizationUnitsList.find(org => org.id === selectedItem.organization_unit?.id),
      });
    }
  }, [selectedItem]);

  const onSubmit = (values: any) => {
    if (isSaving) return;

    try {
      mutate(
        {
          id: values.id,
          organization_unit_id: values?.organization_unit_id?.id,
          type: values?.type?.id,
          description: '',
          serial_number: values.serial_number,
          date_of_start: parseDateForBackend(values?.date_of_start),
          date_of_end: parseDateForBackend(values?.date_of_end),
          file_id: values.file_id,
        },
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
    } catch (e) {
      console.log(e);
    }
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
                  error={errors.date_of_end?.message}
                />
              )}
            />
          </Row>
          <Row>
            <Input {...register('serial_number')} label="BROJ OGLASA:" error={errors.serial_number?.message} />
          </Row>
          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={item => console.log(item)}
              note={<Typography variant="bodySmall" content="Dokument oglasa" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </ModalContentWrapper>
      }
      title={selectedItem?.id ? 'IZMJENITE OGLAS' : 'DODAJTE NOVI OGLAS'}
    />
  );
};

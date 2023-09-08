import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useJobTenderInsert from '../../services/graphql/jobTenders/useJobTenderInsert';
import {JobTenderForm, JobTenderParams, JobTendersModal} from '../../types/graphql/jobTenders';
import {FileUploadWrapper, ModalContentWrapper, Row} from '../education/modals/styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';

const initialValues: JobTenderForm = {
  id: 0,
  organization_unit_id: null,
  date_of_start: null,
  date_of_end: null,
  serial_number: '',
  type: undefined,
  description: '',
  file_id: 0,
};

export const JobTenderModal: React.FC<JobTendersModal> = ({
  selectedItem,
  open,
  onClose,
  organizationUnitsList,
  dropdownJobTenderType,
  alert,
  refetch,
}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          type: selectedItem.type,
        }
      : initialValues;
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: initialValues});

  const {mutate} = useJobTenderInsert();

  useEffect(() => {
    if (item) {
      reset({
        ...item,
        date_of_end: parseToDate(item.date_of_end),
        date_of_start: parseToDate(item.date_of_start),
        organization_unit_id: organizationUnitsList.find(org => org.id === item.organization_unit.id),
      });
    }
  }, [item]);

  const onSubmit = (values: any) => {
    try {
      mutate(
        {
          id: values.id,
          organization_unit_id: values?.organization_unit?.id,
          type: values?.type?.id,
          description: '',
          serial_number: values.serial_number,
          date_of_start: parseDateForBackend(values?.date_of_start),
          date_of_end: parseDateForBackend(values?.date_of_end),
          file_id: values.file_id,
        },
        () => {
          reset(initialValues);
          alert.success('Uspješno sačuvano.');
          refetch();
          onClose();
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
        reset(item);
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <ModalContentWrapper>
          <Row>
            <Controller
              name="type"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="TIP OGLASA:"
                  name={name}
                  options={dropdownJobTenderType as any}
                  value={value as any}
                  onChange={onChange}
                  error={errors.type?.message as string}
                />
              )}
            />

            <Controller
              name="organization_unit_id"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA:"
                  name={name}
                  options={organizationUnitsList.slice(1) as any}
                  value={value as any}
                  onChange={onChange}
                  error={errors.organization_unit_id?.message as string}
                />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="date_of_start"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM OBJAVE:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />

            <Controller
              name="date_of_end"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ZAKLJUČENJA:"
                  name={name}
                  selected={value ? new Date(value) : null}
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('serial_number', {required: 'Ovo polje je obavezno'})}
              label="BROJ OGLASA:"
              error={errors.serial_number?.message as string}
            />
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
      title={'DODAJTE NOVI OGLAS'}
    />
  );
};

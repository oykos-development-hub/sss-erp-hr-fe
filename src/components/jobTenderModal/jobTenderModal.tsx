import {CheckIcon, Datepicker, Dropdown, FileUpload, Input, Modal, Theme, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useJobTenderInsert from '../../services/graphql/jobTenders/useJobTenderInsert';
import {JobTenderParams, JobTendersModal} from '../../types/graphql/jobTenders';
import {parseDate} from '../../utils/dateUtils';
import {FileUploadWrapper, ModalContentWrapper, Row} from '../education/modals/styles';

const initialValues: JobTenderParams = {
  id: 0,
  organization_unit_id: 0,
  date_of_start: '',
  date_of_end: '',
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
          type_tender: selectedItem.type,
        }
      : initialValues;
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item || initialValues});

  const {mutate} = useJobTenderInsert();

  useEffect(() => {
    if (item) {
      reset(item);
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
          date_of_start: parseDate(values?.date_of_start, true),
          date_of_end: parseDate(values?.date_of_end, true),
          file_id: values.file_id,
        },
        () => {
          reset(initialValues);
          alert.success('Uspješno ste dodali oglas.');
          refetch();
          onClose();
        },
        () => {
          alert.success('Uspješno ste dodali oglas.');
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
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.expertise_level?.message as string}
                />
              )}
            />

            <Controller
              name="organization_unit"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA:"
                  name={name}
                  options={organizationUnitsList as any}
                  value={value as any}
                  onChange={onChange}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.expertise_level?.message as string}
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
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ZAKLJUČENJA:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('serial_number', {required: 'Ovo polje je obavezno'})}
              label="BROJ OGLASA:"
              error={errors.certificate_issuer?.message as string}
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

import {CheckIcon, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {FormGroup, ModalContentWrapper} from './styles';
import {OrganizationUnitModalProps} from './types';
import {OrganizationUnit} from '../../types/graphql/organizationUnitsTypes';
import useOrganizationUnitInsert from '../../services/graphql/organizationUnits/useOrganizationUnitInsert';

const initialValues: OrganizationUnit = {
  id: 0,
  parent_id: 0,
  number_of_judges: 0,
  title: '',
  abbreviation: '',
  color: '',
  folder_id: 0,
  icon: '',
};

export const OrganizationalUnitModal: React.FC<OrganizationUnitModalProps> = ({
  open,
  onClose,
  dropdownData,
  organizationUnit,
  selectedItem,
  alert,
  refetch,
}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          parent_id: {id: organizationUnit?.id, title: organizationUnit?.title},
        }
      : {
          ...initialValues,
          parent_id: {id: organizationUnit?.id, title: organizationUnit?.title},
        };
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item || initialValues});

  const {mutate, loading: isSaving} = useOrganizationUnitInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    if (!isSaving) return;

    try {
      mutate(
        {
          ...values,
          title: values?.title,
          abbreviation: values?.abbreviation,
          parent_id: organizationUnit?.id,
          description: values?.description,
          address: values?.address,
          number_of_judges: values?.number_of_judges || 0,
          folder_id: values?.folder_id || 0,
        },
        () => {
          alert.success('Uspješno sačuvano.');
          refetch();
          onClose(true);
          reset(initialValues);
        },
        () => {
          alert.error('Greška. Promjena nije sačuvana.');
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
        onClose(false);
        reset(item);
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="parent_id"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="PARENT:"
                  options={dropdownData || []}
                  error={errors.parent_id?.message as string}
                  isDisabled
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Input
              {...register('title', {required: 'Ovo polje je obavezno'})}
              label="NAZIV:"
              error={errors.title?.message as string}
            />
          </FormGroup>
          <FormGroup>
            <Input
              {...register('abbreviation', {required: 'Ovo polje je obavezno'})}
              label="SKRAĆENICA:"
              error={errors.abbreviation?.message as string}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('address')} label="ADRESA:" error={errors.address?.message as string} />
          </FormGroup>

          <FormGroup>
            <Input
              {...register('description')}
              textarea={true}
              label="OPIS:"
              error={errors.description?.message as string}
            />
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'DODAJ NOVO ODJELJENJE'}
    />
  );
};

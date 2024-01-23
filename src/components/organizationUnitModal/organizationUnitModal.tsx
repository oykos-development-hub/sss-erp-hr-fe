import {Dropdown, Input, Modal} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useOrganizationUnitInsert from '../../services/graphql/organizationUnits/useInsertOrganizatonUnit';
import {OrganizationUnit} from '../../types/graphql/organizationUnits';
import {FormGroup, ModalContentWrapper} from './styles';
import {OrganizationUnitModalProps} from './types';

const initialValues: OrganizationUnit = {
  id: 0,
  parent_id: 0,
  number_of_judges: 0,
  title: '',
  abbreviation: '',
  description: '',
  address: '',
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

  const {alert} = useAppContext();

  const {mutate, loading: isSaving} = useOrganizationUnitInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    if (isSaving) return;
    const data = {
      ...values,
      parent_id: organizationUnit?.id,
      number_of_judges: values?.number_of_judges || 0,
      folder_id: values?.folder_id || 0,
    };

    delete data.job_positions_organization_units;

    try {
      mutate(
        data,
        () => {
          alert.success('Uspješno sačuvano.');
          refetch();
          onClose();
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
        onClose();
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
                  isRequired
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
              isRequired
            />
          </FormGroup>
          <FormGroup>
            <Input
              {...register('abbreviation', {required: 'Ovo polje je obavezno'})}
              label="SKRAĆENICA:"
              isRequired
              error={errors.abbreviation?.message as string}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('address')} label="ADRESA:" />
          </FormGroup>

          <FormGroup>
            <Input {...register('description')} textarea label="OPIS:" />
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVO ODJELJENJE'}
    />
  );
};

import React, {useEffect, useMemo} from 'react';
import {FormGroup, ModalForm, ModalSection, ModalSectionTitle, RevisionModal, Row} from './styles';
import {Dropdown, Input, FileUpload, Datepicker} from 'client-library';
import {InternalRevisionFormValues} from '../../screens/internalRevision/types';
import {Controller, useForm} from 'react-hook-form';
import {yearsForDropdown} from '../../utils/constants';
import {FileUploadVariants} from '@oykos-development/devkit-react-ts-styled-components';
import {parseDate} from '../../utils/dateUtils';
import {
  quarterOptions,
  revisionDeadlineOptions,
  revisionPriorityOptions,
  revisionStatusOptions,
  revisionTypeOptions,
} from '../../constants';
import {DropdownDataNumber} from '../../types/dropdownData';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import useRevisionDetails from '../../services/graphql/internalRevision/useRevision';
import useRevisionInsert from '../../services/graphql/internalRevision/useRevisionInsert';

interface InternalRevisionModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
  refetchList: () => void;
  revisorOptions: DropdownDataNumber[];
  alert: any;
}

const secondFormSectionFields = [
  'serial_number',
  'priority',
  'date_of_revision',
  'responsible_user_profile',
  'date_of_acceptance',
  'date_of_rejection',
  'implementation_month_span',
  'date_of_implementation',
  'implementation_suggestion',
];

const thirdFormSectionFields = [
  'state_of_implementation',
  'implementation_failed_description',
  'responsible_user_profile',
  'second_implementation_month_span',
  'implementation_failed_description',
  'second_date_of_revision',
];

const initialValues: InternalRevisionFormValues = {
  revision_type: null,
  revision_type_id: 0,
  revisor_user_profile: null,
  revisor_user_profile_id: 0,
  revision_organization_unit: null,
  revision_organization_unit_id: 0,
  responsible_user_profile: null,
  responsible_user_profile_id: 0,
  implementation_user_profile: null,
  implementation_user_profile_id: 0,
  title: '',
  planned_year: null,
  planned_quarter: null,
  serial_number: '',
  priority: '',
  date_of_revision: '',
  date_of_acceptance: '',
  date_of_rejection: '',
  implementation_suggestion: '',
  implementation_month_span: '',
  date_of_implementation: '',
  state_of_implementation: null,
  implementation_failed_description: '',
  second_implementation_month_span: '',
  second_date_of_revision: '',
  file_id: 0,
};

const InternalRevisionModal: React.FC<InternalRevisionModalProps> = ({
  open,
  onClose,
  id,
  refetchList,
  revisorOptions,
  alert,
}) => {
  const {data} = useRevisionDetails(id);
  const {mutate} = useRevisionInsert();
  const {organizationUnitsList} = useOrganizationUnits();

  const {
    register,
    handleSubmit,
    formState: {errors, dirtyFields},
    control,
    reset,
    watch,
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = (values: InternalRevisionFormValues) => {
    const data = {
      ...values,
      implementation_user_profile_id: 1,
      revision_type_id: values.revision_type?.id || 0,
      revisor_user_profile_id: values.revisor_user_profile?.id || 0,
      revision_organization_unit_id: values.revision_organization_unit?.id || 0,
      responsible_user_profile_id: values.responsible_user_profile?.id || 0,
      planned_year: values.planned_year?.id || '',
      planned_quarter: values.planned_quarter?.id || '',
      state_of_implementation: values.state_of_implementation?.id || '',
      id,
    };

    delete data.revision_type;
    delete data.revisor_user_profile;
    delete data.revision_organization_unit;
    delete data.responsible_user_profile;
    delete data.implementation_user_profile;

    mutate(
      data,
      () => {
        refetchList();
        onClose();
        alert.success(id ? 'Revizija uspješno sačuvana.' : 'Revizija je uspešno dodata.');
        reset(initialValues);
      },
      () => {
        alert.error(
          id ? 'Došlo je do greške prilikom izmjena revizije.' : 'Došlo je do greške prilikom dodavanja revizije.',
        );
      },
    );
  };

  const shouldValidateSecondSection = () => {
    let shouldValidate = false;

    for (const field of secondFormSectionFields) {
      if (Object.keys(dirtyFields).includes(field)) {
        shouldValidate = true;
        break;
      }
    }

    return shouldValidate;
  };

  // const shouldValidateThirdSection = () => {
  //   let shouldValidate = false;

  //   for (const field of thirdFormSectionFields) {
  //     if (Object.keys(dirtyFields).includes(field)) {
  //       shouldValidate = true;
  //       break;
  //     }
  //   }

  //   return shouldValidate;
  // };

  const onUpload = () => {
    console.log('upload');
  };

  useEffect(() => {
    if (data && data.items && id) {
      reset({
        ...data.items[0],
        planned_year: {
          id: data.items[0].planned_year,
          title: data.items[0].planned_year,
        },
        planned_quarter: {id: data.items[0].planned_quarter, title: data.items[0].planned_quarter},
        priority: revisionPriorityOptions.find(option => option.id === data.items[0].priority),
      });
    }
  }, [data]);

  const yearOptions = useMemo(
    () => yearsForDropdown().map(year => ({id: year.id.toString(), title: year.title.toString()})),
    [],
  );

  const implemented = watch('state_of_implementation')?.id === 'implemented';

  return (
    <RevisionModal
      onClose={() => {
        reset(initialValues);
        onClose();
      }}
      open={open}
      title="DODAJTE REGISTAR PREPORUKA"
      style={{width: '805px'}}
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <ModalForm>
          {/* ***** PLAN REVIZIJE ****** */}
          <ModalSection>
            <ModalSectionTitle content="PLAN REVIZIJE:" variant="bodyMedium" />
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="planned_year"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={yearOptions}
                      error={errors.planned_year?.message as string}
                      placeholder="Izaberite godinu"
                      label="GODINA:"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="planned_quarter"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={quarterOptions}
                      error={errors.planned_quarter?.message as string}
                      placeholder="Izaberite kvartal"
                      label="KVARTAL ZA SPROVOĐENJE REVIZIJE:"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Input
                  {...register('title', {required: 'Ovo polje je obavezno'})}
                  label="NAZIV REVIZIJE:"
                  placeholder="Izaberite naziv"
                  error={errors.title?.message as string}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="revision_organization_unit"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={organizationUnitsList as any}
                      error={errors.revision_organization_unit?.message as string}
                      placeholder="Izaberite subjekt"
                      label="SUBJEKT REVIZIJE:"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="revisor_user_profile"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisorOptions}
                      error={errors.revisor_user_profile?.message as string}
                      placeholder="Izaberite revizore"
                      label="REVIZOR KOJI JE DAO PREPORUKU:"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="revision_type"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionTypeOptions}
                      error={errors.revision_type?.message as string}
                      placeholder="Izaberite vrstu revizije"
                      label="VRSTA REVIZIJE:"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <FileUpload variant={FileUploadVariants.tertiary} onUpload={onUpload} />
          </ModalSection>

          {/* ***** PREPORUKE REVIZIJE ****** */}
          <ModalSection>
            <ModalSectionTitle content="PREPORUKE REVIZIJE:" variant="bodyMedium" />
            <Row>
              <FormGroup>
                <Input
                  {...register('serial_number', {
                    required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'},
                  })}
                  label="BROJ REVIZIJE:"
                  placeholder="Unesite broj revizije"
                  error={errors.serial_number?.message as string}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="priority"
                  rules={{required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'}}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionPriorityOptions}
                      error={errors.priority?.message as string}
                      placeholder="Izaberite prioritet revizije"
                      label="PRIORITET REVIZIJE:"
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
                  rules={{required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'}}}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM REVIZIJE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.date_of_revision?.message as string}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  {...register('responsible_user_profile', {
                    required: {
                      value: shouldValidateSecondSection(),
                      message: 'Ovo polje je obavezno',
                    },
                  })}
                  error={errors.responsible_user_profile?.message as string}
                  placeholder="Unesite odgovorno lice"
                  label="ODGOVORNO LICE ZA PROVOĐENJE PREPORUKE:"
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  name="date_of_acceptance"
                  control={control}
                  rules={{required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'}}}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM PRIHVATANJA AKCIONOG PLANA:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.date_of_acceptance?.message as string}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="date_of_implementation"
                  rules={{required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'}}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionDeadlineOptions}
                      error={errors.date_of_implementation?.message as string}
                      placeholder="Izaberite rok"
                      label="ROK SPROVOĐENJA PREPORUKE:"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  name="date_of_rejection"
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM NEPRIHVATANJA PREPORUKE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.date_of_rejection?.message as string}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="date_of_implementation"
                  rules={{required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'}}}
                  render={({field: {name, value, onChange}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM SPROVOĐENJA PREPORUKE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.date_of_implementation?.message as string}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Input
                  {...register('implementation_suggestion', {
                    required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'},
                  })}
                  label="PREPORUKA:"
                  placeholder="Unesite preporuku"
                  error={errors.implementation_suggestion?.message as string}
                />
              </FormGroup>
            </Row>
            {/* <Controller
              name="state_of_implementation"
              control={control}
              render={({field: {name, value}}) => {
                return (
                  <CheckboxContainer>
                    <Checkbox
                      onChange={() => setValue('state_of_implementation', !value)}
                      name={name}
                      checked={value}
                    />
                    <CheckboxLabel content="Neograničeno Trajanje" variant="bodySmall" />
                  </CheckboxContainer>
                );
              }}
            /> */}
          </ModalSection>

          {/* ***** SPROVODJENJE REVIZIJE ****** */}
          <ModalSection>
            <ModalSectionTitle content="SPROVOĐENJE REVIZIJE:" variant="bodyMedium" />
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="state_of_implementation"
                  // rules={{required: {value: shouldValidateThirdSection, message: 'Ovo polje je obavezno'}}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionStatusOptions}
                      error={errors.state_of_implementation?.message as string}
                      placeholder="Izaberite status"
                      label="STATUS SPROVOĐENJA:"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  // {...register('title')}
                  label="REF. DOKUMENTA ZA PRAĆENJE SPROVOĐENJE PREPORUKA:"
                  placeholder="Unesite dokumenta za praćenje"
                  error={errors.title?.message as string}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="implementation_user_profile"
                  // rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionStatusOptions}
                      error={errors.implementation_user_profile?.message as string}
                      placeholder="Izaberite opciju"
                      label="IMPLEMENTACIJU PREPORUKE POTVRDIO:"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="second_implementation_month_span"
                  // rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionDeadlineOptions}
                      error={errors.second_implementation_month_span?.message as string}
                      placeholder="Izaberite novi rok"
                      label="NOVI ROK SPROVOĐENJA PREPORUKE:"
                      isDisabled={implemented}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Input
                  {...register('implementation_failed_description')}
                  label="RAZLOZI NESPROVOĐENJA:"
                  placeholder="Unesite razloge"
                  error={errors.implementation_failed_description?.message as string}
                  disabled={implemented}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="second_date_of_revision"
                  // rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="NOVI DATUM SPROVOĐENJA PREPORUKE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.second_date_of_revision?.message as string}
                      isDisabled={implemented}
                    />
                  )}
                />
              </FormGroup>
            </Row>
          </ModalSection>
        </ModalForm>
      }
    />
  );
};

export default InternalRevisionModal;

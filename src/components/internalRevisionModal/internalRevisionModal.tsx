import React, {useEffect, useMemo, useState} from 'react';
import {FormGroup, ModalForm, ModalSection, ModalSectionTitle, RevisionModal, Row} from './styles';
import {Dropdown, Input, FileUpload, Datepicker} from 'client-library';
import {InternalRevisionFormValues, InternalRevisionInsertParams} from '../../screens/internalRevision/types';
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
import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import useRevisionDetails from '../../services/graphql/internalRevision/useRevision';
import useRevisionInsert from '../../services/graphql/internalRevision/useRevisionInsert';
import useSettingsDropdownOverview from '../../services/graphql/settingsDropdown/useSettingsDropdownOverview';

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
  internal_organization_unit_id: null,
  external_organization_unit_id: null,
  responsible_user_profile: '',
  implementation_user_profile: null,
  implementation_user_profile_id: null,
  title: '',
  planned_year: null,
  planned_quarter: null,
  serial_number: '',
  priority: null,
  date_of_revision: '',
  date_of_acceptance: '',
  date_of_rejection: '',
  implementation_suggestion: '',
  implementation_month_span: null,
  date_of_implementation: '',
  state_of_implementation: null,
  implementation_failed_description: '',
  second_implementation_month_span: null,
  second_date_of_revision: '',
  file_id: 0,
  ref_document: '',
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
  const {organizationUnits} = useOrganizationUnits();
  const {data: settingsTypes} = useSettingsDropdownOverview({entity: 'revision_organization_units_types'});

  const {data: revisionTypes} = useSettingsDropdownOverview({entity: 'revision_types'});

  const revisionList = useMemo(
    () =>
      revisionTypes &&
      revisionTypes?.map(unit => {
        return {
          id: unit.id,
          title: unit.title,
        };
      }),
    [revisionTypes],
  );
  const externalOrganizationUnitsList = useMemo(() => {
    if (!settingsTypes) {
      return [{id: 0, title: 'Sve organizacione jedinice'}];
    }

    return [
      {id: 0, title: 'Sve organizacione jedinice'},
      ...settingsTypes.map(unit => {
        return {id: unit.id, title: unit.title};
      }),
    ];
  }, [settingsTypes]);

  const {
    register,
    handleSubmit,
    formState: {errors, dirtyFields},
    control,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = (values: InternalRevisionFormValues) => {
    const data: InternalRevisionInsertParams = {
      implementation_user_profile_id: values?.implementation_user_profile?.id || null,
      revision_type_id: values?.revision_type?.id,
      responsible_user_profile: values?.responsible_user_profile || '',
      revisor_user_profile_id: values.revisor_user_profile?.id || null,
      internal_organization_unit_id: values.internal_organization_unit_id?.id || null,
      external_organization_unit_id: values.external_organization_unit_id?.id || null,
      planned_year: values.planned_year?.id || '',
      planned_quarter: values.planned_quarter?.id || '',
      state_of_implementation: values.state_of_implementation?.id || '',
      priority: values?.priority?.id,
      date_of_revision: values?.date_of_revision ? parseDate(values?.date_of_revision, true) : undefined,
      date_of_acceptance: values?.date_of_acceptance ? parseDate(values?.date_of_acceptance, true) : undefined,
      date_of_rejection: values?.date_of_rejection ? parseDate(values?.date_of_rejection, true) : undefined,
      date_of_implementation: values?.date_of_implementation
        ? parseDate(values?.date_of_implementation, true)
        : undefined,
      implementation_month_span: values?.implementation_month_span?.id || '',
      second_date_of_revision: values?.second_date_of_revision
        ? parseDate(values?.second_date_of_revision, true)
        : undefined,
      second_implementation_month_span: values?.second_implementation_month_span?.id || '',
      id: id,
      title: values?.title,
      serial_number: values?.serial_number,
      implementation_suggestion: values?.implementation_suggestion,
      implementation_failed_description: values?.implementation_failed_description,
      ref_document: values?.ref_document,
    };

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

  const onUpload = () => {
    console.log('upload');
  };

  useEffect(() => {
    if (data && data.item && id && data.status === 'success') {
      reset({
        ...data.item,
        planned_year: {
          id: data.item.planned_year,
          title: data.item.planned_year,
        },
        internal_organization_unit_id:
          data.item.revision_organization_unit?.value === 'internal'
            ? {
                id: data.item.revision_organization_unit.id,
                title: data.item.revision_organization_unit.title,
              }
            : null,
        external_organization_unit_id:
          data.item.revision_organization_unit?.value === 'external'
            ? {
                id: data.item.revision_organization_unit.id,
                title: data.item.revision_organization_unit.title,
              }
            : null,
        planned_quarter: {id: data.item.planned_quarter, title: data.item.planned_quarter},
        priority: revisionPriorityOptions.find(option => option.id === data.item.priority),
        responsible_user_profile: data.item.responsible_user_profile?.title,
        implementation_month_span: revisionDeadlineOptions.find(
          option => option.id == data.item.implementation_month_span,
        ),
        state_of_implementation: revisionStatusOptions.find(option => option.id === data.item.state_of_implementation),
        second_implementation_month_span: revisionDeadlineOptions.find(
          option => option.id == data.item.second_implementation_month_span,
        ),
      });
    }
  }, [data]);

  const [dateOfImplementation, setDateOfImplementation] = useState<string | undefined>(undefined);

  const dateOfRevision = watch('date_of_revision');
  const implementationMonthSpan = watch('implementation_month_span');

  const calculateDateOfImplementation = (revisionDate: string, monthSpan: DropdownDataString | null) => {
    const parsedDateOfRevision = new Date(revisionDate);
    const monthsToAdd = Number(monthSpan?.id);
    parsedDateOfRevision.setMonth(parsedDateOfRevision.getMonth() + monthsToAdd);

    return parseDate(parsedDateOfRevision);
  };

  useEffect(() => {
    if (dateOfRevision && implementationMonthSpan) {
      const formattedDate = calculateDateOfImplementation(dateOfRevision, implementationMonthSpan);
      setDateOfImplementation(formattedDate);
    }
  }, [dateOfRevision, implementationMonthSpan]);

  const yearOptions = useMemo(
    () => yearsForDropdown().map(year => ({id: year.id.toString(), title: year.title.toString()})),
    [],
  );

  const implemented = watch('state_of_implementation')?.id === 'implemented';
  const internalSubject = watch('internal_organization_unit_id');
  const externalSubject = watch('external_organization_unit_id');

  const organizationUnitsList = useMemo(() => {
    return organizationUnits
      .filter(i => !i.parent_id)
      .map(unit => {
        return {id: unit.id, title: unit.title};
      });
  }, [organizationUnits]);

  useEffect(() => {
    if (internalSubject) {
      setValue('external_organization_unit_id', null);
    }
  }, [internalSubject, setValue]);

  useEffect(() => {
    if (externalSubject) {
      setValue('internal_organization_unit_id', null);
    }
  }, [externalSubject, setValue]);

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
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="internal_organization_unit_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={organizationUnitsList as any}
                      error={errors.internal_organization_unit_id?.message as string}
                      placeholder="Izaberite subjekt"
                      label="SUBJEKT REVIZIJE (interna):"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="external_organization_unit_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={externalOrganizationUnitsList as any}
                      error={errors.external_organization_unit_id?.message as string}
                      placeholder="Izaberite subjekt"
                      label="SUBJEKT REVIZIJE (eksterna):"
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
                {revisionList && (
                  <Controller
                    control={control}
                    name="revision_type"
                    rules={{required: 'Ovo polje je obavezno'}}
                    render={({field: {name, value, onChange}}) => (
                      <Dropdown
                        name={name}
                        value={value as any}
                        onChange={onChange}
                        options={revisionList as any}
                        error={errors.revision_type?.message as string}
                        placeholder="Izaberite vrstu revizije"
                        label="VRSTA REVIZIJE:"
                      />
                    )}
                  />
                )}
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
                      selected={value ? new Date(value) : ''}
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
                      selected={value ? new Date(value) : ''}
                      error={errors.date_of_acceptance?.message as string}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="implementation_month_span"
                  rules={{required: {value: shouldValidateSecondSection(), message: 'Ovo polje je obavezno'}}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionDeadlineOptions}
                      error={errors.implementation_month_span?.message as string}
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
                      selected={value ? new Date(value) : ''}
                      error={errors.date_of_rejection?.message as string}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  {...register('date_of_implementation')}
                  label="DATUM SPROVOĐENJA PREPORUKE:"
                  value={dateOfImplementation}
                  disabled
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
                  {...register('ref_document')}
                  label="REF. DOKUMENTA ZA PRAĆENJE SPROVOĐENJE PREPORUKA:"
                  placeholder="Unesite dokumenta za praćenje"
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
                      options={revisorOptions}
                      // error={errors.implementation_user_profile?.message as string}
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
                      selected={value ? new Date(value) : ''}
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

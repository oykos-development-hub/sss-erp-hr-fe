import {Datepicker, Dropdown, Input} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {revisionDeadlineOptions, revisionStatusOptions} from '../../constants';
import useRevisionTipsDetails from '../../services/graphql/revisionTips/useRevisionTipsDetails';
import useRevisionTipsInsert from '../../services/graphql/revisionTips/useRevisionTipsInsert';
import useRevisionTipsOverview from '../../services/graphql/revisionTips/useRevisionTipsOverview';
import {DropdownDataString} from '../../types/dropdownData';
import {MicroserviceProps} from '../../types/micro-service-props';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {FormGroup, FormGroupFullWidth, ModalForm, ModalSection, ModalSectionTitle, RevisionModal, Row} from './styles';

interface revisionPlanProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
  revisionId: number;
  context: MicroserviceProps;
}

const InitialValues = {
  user_profile_id: null,
  date_of_accept: '',
  due_date: null,
  date_of_reject: '',
  date_of_execution: '',
  recommendation: '',
};

export const RevisionTipsModal: React.FC<revisionPlanProps> = ({
  open,
  onClose,
  alert,
  refetchList,
  id,
  revisionId,
  context,
}) => {
  const {data: revisionTipsDetails} = useRevisionTipsDetails(id);
  const {mutate, loading: isSaving} = useRevisionTipsInsert();
  const {data} = useRevisionTipsOverview({page: 1000, size: 1000, revision_id: revisionId});
  const [dateOfImplementation, setDateOfImplementation] = useState<any>();
  const [secondDateOfImplementation, setSecondDateOfImplementation] = useState<any>();

  const location = context?.navigation?.location;
  const dateOfRevision = location?.state?.dateOfRevision;

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
    watch,
  } = useForm({defaultValues: revisionTipsDetails || InitialValues});

  const implementationMonthSpan = watch('due_date');
  const secondMonthSpan = watch('new_due_date');

  const revisorsList = data?.revisors?.map((unit: any) => {
    return {
      id: unit.id,
      title: unit.title,
    };
  });

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const data = {
      ...values,
      responsible_person: values?.responsible_person || '',
      date_of_accept: parseDateForBackend(values?.date_of_accept) ?? undefined,
      due_date: values?.due_date.id ?? undefined,
      date_of_reject: parseDateForBackend(values?.date_of_reject) ?? undefined,
      date_of_execution: parseDateForBackend(dateOfImplementation) ?? undefined,
      new_date_of_execution: parseDateForBackend(secondDateOfImplementation) ?? undefined,
      recommendation: values?.recommendation || '',
      revision_id: revisionId,
      status: values.status?.id || '',
      documents: values.documents || '',
      reasons_for_non_executing: values.reasons_for_non_executing || '',
      user_profile_id: values?.user_profile_id?.id || null,
      new_due_date: values?.new_due_date?.id,
    };

    mutate(
      data,
      () => {
        refetchList();
        onClose();
        reset(InitialValues);
        alert.success(revisionTipsDetails.item.id ? 'Preporuka uspješno sačuvana.' : 'Preporuka je uspešno dodata.');
      },
      () => {
        alert.error(
          revisionTipsDetails.item.id
            ? 'Došlo je do greške prilikom izmjene preporuke.'
            : 'Došlo je do greške prilikom dodavanja preporuke.',
        );
      },
    );
  };

  useEffect(() => {
    if (revisionTipsDetails && revisionTipsDetails.item && id && revisionTipsDetails.status === 'success') {
      reset({
        id: id,
        responsible_person: revisionTipsDetails.item.responsible_person,
        date_of_accept: revisionTipsDetails.item.date_of_accept,
        due_date: revisionDeadlineOptions.find(
          (revisionDeadlineOptions: any) => revisionDeadlineOptions.id === revisionTipsDetails.item.due_date,
        ),
        date_of_reject: revisionTipsDetails.item.date_of_reject,
        date_of_execution: revisionTipsDetails.item.date_of_execution,
        new_date_of_execution: revisionTipsDetails.item.new_date_of_execution,
        recommendation: revisionTipsDetails.item.recommendation,
        revision_id: revisionTipsDetails.item.revision_id,
        status: revisionStatusOptions.find(
          (revisionStatusOptions: any) => revisionStatusOptions.id === revisionTipsDetails.item.status,
        ),
        documents: revisionTipsDetails.item.documents,
        reasons_for_non_executing: revisionTipsDetails.item.reasons_for_non_executing,
        new_due_date: revisionDeadlineOptions.find(
          (revisionDeadlineOptions: any) => revisionDeadlineOptions.id === revisionTipsDetails.item.new_due_date,
        ),
        user_profile_id: revisorsList.find(
          (revisorsList: any) => revisorsList.id === revisionTipsDetails.item.user_profile.id,
        ),
      });
    }
  }, [revisionTipsDetails]);

  const calculateDateOfImplementation = (revisionDate: string, monthSpan: DropdownDataString | null) => {
    const parsedDateOfRevision = new Date(revisionDate);
    const monthsToAdd = Number(monthSpan);
    parsedDateOfRevision.setMonth(parsedDateOfRevision.getMonth() + monthsToAdd);
    return parsedDateOfRevision;
  };

  useEffect(() => {
    if (dateOfRevision && implementationMonthSpan) {
      const formattedDate = calculateDateOfImplementation(dateOfRevision, implementationMonthSpan.id);
      setDateOfImplementation(formattedDate);
    }

    if (implementationMonthSpan && secondMonthSpan) {
      const formattedSecondDate = calculateDateOfImplementation(dateOfImplementation, secondMonthSpan.id);
      setSecondDateOfImplementation(formattedSecondDate);
    }
  }, [dateOfRevision, implementationMonthSpan, secondMonthSpan]);

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
                  label="ODGOVORNO LICE ZA PROVOĐENJE PREPORUKE:"
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  name="date_of_accept"
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM PRIHVATANJA AKCIONOG PLANA:"
                      name={name}
                      selected={value ? new Date(value) : ''}
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
                      value={value as any}
                      onChange={onChange}
                      options={revisionDeadlineOptions}
                      error={errors.due_date?.message as string}
                      placeholder="Izaberite rok"
                      label="ROK SPROVOĐENJA PREPORUKE:"
                      isDisabled={revisionTipsDetails?.item?.new_due_date && true}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  name="date_of_reject"
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM NEPRIHVATANJA PREPORUKE:"
                      name={name}
                      selected={value ? new Date(value) : ''}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <FormGroupFullWidth>
              <Input
                {...register('date_of_execution')}
                label="DATUM SPROVOĐENJA PREPORUKE:"
                value={dateOfImplementation && parseDate(dateOfImplementation)}
                disabled
              />
            </FormGroupFullWidth>
            <FormGroupFullWidth>
              <Input
                {...register('recommendation', {
                  required: 'Ovo polje je obavezno',
                })}
                textarea
                label="PREPORUKA:"
                placeholder="Unesite preporuku"
                error={errors.recommendation?.message as string}
              />
            </FormGroupFullWidth>
            {id > 0 && (
              <ModalSection>
                <ModalSectionTitle content="SPROVOĐENJE REVIZIJE:" variant="bodyMedium" />
                <Row>
                  <FormGroup>
                    <Controller
                      control={control}
                      name="status"
                      render={({field: {name, value, onChange}}) => (
                        <Dropdown
                          name={name}
                          value={value as any}
                          onChange={onChange}
                          options={revisionStatusOptions}
                          label="STATUS SPROVOĐENJA:"
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
                      name="user_profile_id"
                      render={({field: {name, value, onChange}}) => (
                        <Dropdown
                          name={name}
                          value={value as any}
                          onChange={onChange}
                          options={revisorsList || []}
                          placeholder="Izaberite revizora"
                          label="IMPLEMENTACIJU PREPORUKE POTVRDIO:"
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
                          value={value as any}
                          onChange={onChange}
                          options={revisionDeadlineOptions}
                          label="NOVI ROK SPROVOĐENJA PREPORUKE:"
                        />
                      )}
                    />
                  </FormGroup>
                </Row>
                <Row>
                  <Input {...register('reasons_for_non_executing')} label="RAZLOZI NESPROVOĐENJA:" />
                  <FormGroup>
                    <Input
                      {...register('new_date_of_execution')}
                      label="NOVI DATUM:"
                      value={secondDateOfImplementation && parseDate(secondDateOfImplementation)}
                      disabled
                    />
                  </FormGroup>
                </Row>
              </ModalSection>
            )}
          </ModalSection>
        </ModalForm>
      }
    />
  );
};

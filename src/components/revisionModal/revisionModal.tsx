import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {quarterOptions, revisionPriorityOptions} from '../../constants';
import useRevisionDetails from '../../services/graphql/revision/useRevisionDetails';
import useRevisionInsert from '../../services/graphql/revision/useRevisionInsert';
import useRevisionOverview from '../../services/graphql/revision/useRevisionOverview';
import useSettingsDropdownOverview from '../../services/graphql/settingsDropdown/useSettingsDropdownOverview';
import useSuppliersOverview from '../../services/graphql/suppliers/useGetSuppliersOverview';
import {revisionInsertItem} from '../../types/graphql/revisionInsert';
import {FileUploadWrapper, FormGroup, ModalForm, ModalSection, Row} from './styles';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';

interface revisionProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
  planId: number;
}

const InitialValues = {
  id: null,
  title: '',
  plan_id: 0,
  serial_number: '',
  date_of_revision: '',
  revision_priority: '',
  revision_quartal: '',
  internal_revision_subject_id: null,
  external_revision_subject_id: null,
  revisor_id: null,
  revision_type_id: null,
};

export const RevisionModal: React.FC<revisionProps> = ({open, onClose, alert, refetchList, id, planId}) => {
  const {revisionDetails} = useRevisionDetails(id);
  const {mutate, loading: isSaving} = useRevisionInsert();
  const {suppliers} = useSuppliersOverview();
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const {data} = useRevisionOverview({
    page: 1000,
    size: 1000,
    plan_id: planId,
    internal_revision_subject_id: 0,
    revision_type_id: 0,
    revisor_id: 0,
  });

  const {data: revisionTypes} = useSettingsDropdownOverview({entity: 'revision_types'});

  const revisionsList = useMemo(
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

  const revisorsList = useMemo(
    () =>
      data &&
      data?.revisors?.map((unit: any) => {
        return {
          id: unit.id,
          title: unit.title,
        };
      }),
    [data],
  );

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
    watch,
    setValue,
  } = useForm({defaultValues: revisionDetails || InitialValues});

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const data: revisionInsertItem = {
      id: values?.id,
      title: values?.title || null,
      plan_id: planId,
      serial_number: values?.serial_number || null,
      date_of_revision: values?.date_of_revision || null,
      revision_priority: values?.revision_priority.id || null,
      revision_quartal: values?.revision_quartal.id || null,
      internal_revision_subject_id: values?.internal_revision_subject_id?.id
        ? values?.internal_revision_subject_id?.id
        : null,
      external_revision_subject_id: values?.external_revision_subject_id?.id || null,
      revisor_id: values?.revisor_id.id || null,
      revision_type_id: values?.revision_type_id.id || null,
    };

    mutate(
      data,
      () => {
        refetchList();
        onClose();
        reset(InitialValues);
        alert.success(revisionDetails?.item?.id ? 'Revizija uspješno sačuvan.' : 'Revizija je uspešno dodat.');
      },
      () => {
        alert.error(
          revisionDetails?.item.id
            ? 'Došlo je do greške prilikom izmjene revizije.'
            : 'Došlo je do greške prilikom dodavanja revizije.',
        );
      },
    );
  };

  const internalSubject = watch('internal_revision_subject_id');
  const externalSubject = watch('external_revision_subject_id');

  useEffect(() => {
    if (internalSubject) {
      setValue('external_revision_subject_id', null);
    }
  }, [internalSubject, setValue]);

  useEffect(() => {
    if (externalSubject) {
      setValue('internal_revision_subject_id', null);
    }
  }, [externalSubject, setValue]);

  useEffect(() => {
    if (revisionDetails && revisionDetails.item && id && revisionDetails.status === 'success') {
      reset({
        id: revisionDetails.item.id,
        title: revisionDetails.item.title,
        plan_id: revisionDetails.item.plan_id,
        serial_number: revisionDetails.item.serial_number,
        date_of_revision: revisionDetails.item.date_of_revision,
        revision_priority: revisionPriorityOptions.find(
          (revisionPriorityOptions: any) => revisionPriorityOptions.id === revisionDetails.item.revision_priority,
        ),
        revision_quartal: quarterOptions.find(
          (quarterOptions: any) => quarterOptions.id === revisionDetails.item.revision_quartal,
        ),
        internal_revision_subject_id: organizationUnits.find(
          (organizationUnitsList: any) =>
            organizationUnitsList.id === revisionDetails.item.internal_revision_subject.id,
        ),
        external_revision_subject_id: suppliers.find(
          (suppliers: any) => suppliers.id === revisionDetails.item.external_revision_subject.id,
        ),
        revisor_id: revisorsList.find((revisorsList: any) => revisorsList.title === revisionDetails.item.revisor.title),
        revision_type_id: revisionsList?.find(
          (revisionsList: any) => revisionsList.title === revisionDetails.item.revision_type.title,
        ),
      });
    }
  }, [revisionDetails]);

  return (
    <Modal
      onClose={() => onClose()}
      open={open}
      title={'DODAJ PLAN'}
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalForm>
          <ModalSection>
            <Row>
              <FormGroup>
                <Input
                  {...register('title', {required: 'Ovo polje je obavezno'})}
                  label="NAZIV REVIZIJE"
                  placeholder="Unesite naziv"
                  error={errors.title?.message as string}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  {...register('serial_number', {required: 'Ovo polje je obavezno'})}
                  label="BROJ REVIZIJE"
                  placeholder="Unesite broj"
                  error={errors.title?.message as string}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  name="date_of_revision"
                  control={control}
                  rules={{required: 'Ovo polje je obavezno'}}
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
                <Controller
                  control={control}
                  name="revision_priority"
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionPriorityOptions}
                      error={errors.revision_priority?.message as string}
                      placeholder="Izaberite prioritet revizije"
                      label="PRIORITET REVIZIJE:"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <Controller
                control={control}
                name="revision_quartal"
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value as any}
                    onChange={onChange}
                    options={quarterOptions}
                    error={errors.revision_quartal?.message as string}
                    placeholder="Izaberite kvartal"
                    label="KVARTAL ZA SPROVOĐENJE REVIZIJE:"
                  />
                )}
              />
            </Row>
            <Row>
              <FormGroup>
                <Controller
                  control={control}
                  name="internal_revision_subject_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={organizationUnits}
                      error={errors.internal_revision_subject_id?.message as string}
                      placeholder="Izaberite subjekt"
                      label="SUBJEKT REVIZIJE (interna):"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="external_revision_subject_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={suppliers as any}
                      error={errors.external_revision_subject_id?.message as string}
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
                  name="revisor_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisorsList as any}
                      error={errors.revisor_id?.message as string}
                      placeholder="Izaberite revizora"
                      label="REVIZOR"
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  control={control}
                  name="revision_type_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      options={revisionsList ? revisionsList : ([] as any)}
                      error={errors.revision_type_id?.message as string}
                      placeholder="Izaberite vrstu revizije"
                      label="VRSTA REVIZIJE"
                    />
                  )}
                />
              </FormGroup>
            </Row>
          </ModalSection>
          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={(item: any) => console.log(item)}
              note={<Typography variant="bodySmall" content="Upload dokumenta" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </ModalForm>
      }
    />
  );
};

import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yesOrNoOptionsString} from '../../constants';
import {ExperienceModalProps} from '../../screens/employees/experience/types';
import {formatData} from '../../screens/employees/experience/utils';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useInsertExperience from '../../services/graphql/userProfile/experience/useInsertExperience';
import {DropdownDataString} from '../../types/dropdownData';
import {calculateExperience, parseToDate} from '../../utils/dateUtils';
import {FileUploadWrapper, FormWrapper, Row} from './styles';
import useAppContext from '../../context/useAppContext';

const experienceSchema = yup.object().shape({
  relevant: yup
    .object()
    .default(undefined)
    .required('Ovo polje je obavezno')
    .shape({id: yup.string().required(), title: yup.string().required()}),
  amount_of_experience: yup.number().required('Ovo polje je obavezno'),
  amount_of_insured_experience: yup
    .number()
    .transform(value => (!value || isNaN(value) ? null : value))
    .nullable(),
  date_of_end: yup
    .date()
    .required('Ovo polje je obavezno')
    .min(yup.ref('date_of_start'), 'Kraj radnog odnosa ne može biti prije početka radnog odnosa.')
    .nullable(),
  date_of_start: yup.date().required('Ovo polje je obavezno').nullable(),
  organization_unit: yup.string().when('relevant', {
    is: (value: DropdownDataString) => value && value.id === 'Ne',
    then: schema => schema.required('Ovo polje je obavezno'),
    otherwise: schema => schema.optional(),
  }),
  organization_unit_id: yup
    .object()
    .nullable()
    .default(undefined)
    .when('relevant', {
      is: (value: DropdownDataString) => value && value.id === 'Da',
      then: schema => schema.required('Ovo polje je obavezno'),
      otherwise: schema => schema.optional(),
    }),
  user_profile_id: yup.number().required(),
});

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  refetchList,
  selectedItem,
  open,
  onClose,
  userProfileId,
  alert,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors},
    reset,
    setValue,
  } = useForm({resolver: yupResolver(experienceSchema), defaultValues: {user_profile_id: userProfileId}});
  const [files, setFiles] = useState<FileList | null>(null);
  const {
    fileService: {uploadFile},
  } = useAppContext();
  const {insertExperience, loading: isSaving} = useInsertExperience();
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});

  const {relevant, date_of_start, date_of_end, organization_unit, organization_unit_id} = watch();

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        relevant: {id: selectedItem?.relevant ? 'Da' : 'Ne', title: selectedItem?.relevant ? 'Da' : 'Ne'},
        organization_unit_id: organizationUnits.find(orgUnit => orgUnit.id === selectedItem?.organization_unit_id),
        date_of_start: parseToDate(selectedItem?.date_of_start),
        date_of_end: parseToDate(selectedItem?.date_of_end),
        user_profile_id: userProfileId,
      });
    }
  }, [selectedItem]);

  const handleInsertExperience = async (data: any) => {
    await insertExperience(
      data,
      () => {
        alert.success('Uspješno sačuvano.');
        refetchList && refetchList();
        onClose();
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const onSubmit = async (data: any) => {
    if (isSaving) return;

    const payload = formatData(data, !selectedItem);

    if (files) {
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(null);
          const updatedData = {...payload, reference_file_id: res[0]?.id};
          handleInsertExperience(updatedData);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      handleInsertExperience(payload);
    }
  };

  const isOrgUnitDisabled = relevant?.id === 'Da' || !relevant;

  useEffect(() => {
    if (date_of_end && date_of_start) {
      const calculatedExperience = calculateExperience(date_of_start, date_of_end);
      setValue('amount_of_experience', calculatedExperience);
    }

    if (organization_unit && isOrgUnitDisabled) {
      setValue('organization_unit', '');
    }

    if (organization_unit_id && !isOrgUnitDisabled) {
      setValue('organization_unit_id', {id: '', title: ''});
    }
  }, [date_of_end, date_of_start, isOrgUnitDisabled]);

  const handleFileUpload = (files: FileList) => {
    setFiles(files);
    alert.success('Fajlovi uspješno učitani');
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="relevant"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="SUDSTVO:"
                    options={yesOrNoOptionsString}
                    error={errors.relevant?.message}
                    isRequired
                  />
                );
              }}
            />
            <Controller
              name="date_of_start"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="POČETAK RADNOG ODNOSA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message}
                  isRequired
                />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="organization_unit_id"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="JEDINICA:"
                    options={organizationUnits}
                    isDisabled={!isOrgUnitDisabled}
                    error={errors.organization_unit_id?.message}
                    isRequired
                  />
                );
              }}
            />
            <Controller
              name="date_of_end"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="KRAJ RADNOG ODNOSA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_end?.message}
                  isRequired
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('organization_unit')}
              label="ORGANIZACIJA/INSTITUCIJA:"
              error={errors.organization_unit?.message}
              isRequired
              disabled={isOrgUnitDisabled}
            />
            <Input
              {...register('amount_of_insured_experience')}
              label="PRIJAVLJENI STAŽ (MJESECI):"
              type="number"
              value={watch('amount_of_insured_experience')?.toString()}
            />
          </Row>

          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={handleFileUpload}
              note={<Typography variant="bodySmall" content="Dokaz o zaposlenju" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </FormWrapper>
      }
      title={'DODAJTE NOVO ZAPOSLENJE'}
    />
  );
};

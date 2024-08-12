import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {
  ApplicationStatusEnum,
  applicationStatusOptions,
  applicationTypeOptions,
} from '../../screens/jobTenders/constants';
import useInsertJobTenderApplication from '../../services/graphql/jobTenderApplications/useInsertJobTenderApplication';
import useBasicInfoGet from '../../services/graphql/userProfile/basicInfo/useGetBasicInfo';
import useGetUserProfiles from '../../services/graphql/userProfile/useGetUserProfiles';
import {DropdownDataString} from '../../types/dropdownData';
import {JobTender} from '../../types/graphql/jobTenders';
import {MicroserviceProps} from '../../types/micro-service-props';
import {ScreenProps} from '../../types/screen-props';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {
  ConfirmModalContent,
  ModalContentWrapper,
  Row,
  RowFullWidth,
  TriangleIcon,
} from '../JobTenderApplicationModal/styles';
import {JobTenderApplication, JobTenderApplicationInsertParams} from '../../types/graphql/jobTenderApplications';
import useGetSettings from '../../services/graphql/settings/useGetSettings';

const tenderApplicationSchema = yup.object().shape({
  type: yup
    .object()
    .default(undefined)
    .shape({id: yup.string().required(), title: yup.string().required()})
    .required('Ovo polje je obavezno'),
  status: yup
    .object()
    .default(undefined)
    .shape({id: yup.string().required(), title: yup.string().required()})
    .required('Ovo polje je obavezno'),
  date_of_application: yup.date().required('Ovo polje je obavezno').nullable(),
  first_name: yup.string().required('Ovo polje je obavezno'),
  last_name: yup.string().required('Ovo polje je obavezno'),
  official_personal_document_number: yup.string().required('Ovo polje je obavezno'),
  date_of_birth: yup
    .date()
    .required('Ovo polje je obavezno')
    .test('more than 18 year old', 'Kandidat mora biti punoljetan', value => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }),
  citizenship: yup
    .object()
    .default(undefined)
    .shape({id: yup.string(), title: yup.string()})
    .required('Ovo polje je obavezno'),
  user_profile: yup
    .object()
    .default(undefined)
    .shape({id: yup.number(), title: yup.string()})
    .when('type', {
      is: (value: DropdownDataString) => value && value.id === 'internal',
      then: schema => schema.required('Ovo polje je obavezno'),
      otherwise: schema => schema.optional(),
    }),
  evaluation: yup.object(),
  date_of_start: yup.date().nullable(),
  date_of_election: yup.date().nullable(),
  date_of_oath: yup.date().nullable(),
  number_of_assembly: yup.string(),
});

export interface JobTenderApplicationModalModalProps extends ScreenProps {
  selectedItem?: JobTenderApplication;
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  countries?: any[];
  alert: any;
  context: MicroserviceProps;
  jobTender?: JobTender;
  applicationIds: number[];
}

export const JobTenderApplicationModal: React.FC<JobTenderApplicationModalModalProps> = ({
  selectedItem,
  open,
  onClose,
  refetchList,
  countries,
  context,
  jobTender,
  applicationIds,
}) => {
  const [selectedUserId, setSelectedIdUser] = useState<number>(0);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const {settingsData, loading} = useGetSettings({entity: 'evaluation_types'});

  const {userBasicInfo} = useBasicInfoGet(selectedUserId, {skip: !selectedUserId});

  const {userProfiles} = useGetUserProfiles({
    page: 1,
    size: 1000,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      type: {id: 'internal', title: 'Interni'},
      status: {id: ApplicationStatusEnum.WAITING, title: 'Na čekanju'},
    },
    resolver: yupResolver(tenderApplicationSchema),
  });

  const {status, type, user_profile} = watch();

  const {insertJobTenderApplication, loading: isSaving} = useInsertJobTenderApplication();

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const data: JobTenderApplicationInsertParams = {
      type: values.type.id,
      date_of_application: parseDateForBackend(values?.date_of_application) ?? '',
      status: values?.status?.title,
      job_tender_id: jobTender?.id ?? 0,
      active: true,
      date_of_election: parseDateForBackend(values?.date_of_election),
      date_of_oath: parseDateForBackend(values?.date_of_oath),
      date_of_start: parseDateForBackend(values?.date_of_start),
      number_of_assembly: values?.number_of_assembly,
    };

    if (!selectedItem?.id && !data.status) data.status = ApplicationStatusEnum.WAITING;

    if (values?.id) data.id = values?.id;
    if (data.type === 'external') {
      data.evaluation = values?.evaluation?.id;
      data.first_name = values.first_name;
      data.last_name = values.last_name;
      data.citizenship = values?.citizenship?.id;
      data.date_of_birth = parseDateForBackend(values?.date_of_birth) ?? '';
      data.official_personal_document_number = values?.official_personal_document_number;
    } else {
      data.user_profile_id = values?.user_profile?.id;
    }

    try {
      if (data.status === 'Izabran' && data.type === 'external' && selectedItem?.status !== 'Izabran') {
        navigateToUserCreation(data);
      } else {
        insertJobTenderApplication(
          data,
          () => {
            context.alert.success('Uspješno sačuvano.');
            refetchList();
            onClose();
            reset();
          },
          () => {
            context.alert.error('Greška. Promjene nisu sačuvane.');
            onClose();
            reset();
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const userOptions = useMemo(() => {
    if (!userProfiles) return [];

    const availableEmployees = userProfiles
      .filter(item => !applicationIds.includes(item.id))
      .filter(item =>
        jobTender?.type?.title === 'Javni oglas za izbor kandidata za sudije' ? !item.is_judge : item.is_judge,
      )
      .map(item => ({...item, title: `${item.first_name} ${item.last_name}`}));

    return availableEmployees || [];
  }, [userProfiles, applicationIds, jobTender]);

  const toggleConfirmModal = () => {
    setConfirmationModal(prev => !prev);
  };

  const nationality = watch('citizenship');
  const navigateToUserCreation = (applicantData: JobTenderApplicationInsertParams) => {
    const {first_name, last_name, date_of_birth, evaluation, official_personal_document_number} = watch();

    context.navigation.navigate('/hr/employees/add-new', {
      state: {
        user: {
          first_name,
          last_name,
          date_of_birth,
          evaluation,
          nationality,
          official_personal_document_number,
          is_judge: true,
          is_president: jobTender?.type?.title === 'Javni oglas za predsjednika suda',
          organization_unit_id: jobTender?.organization_unit?.id,
        },
        application: applicantData,
      },
    });
  };
  // Choosing an internal user to populate the corresponding fields.
  useEffect(() => {
    if (userBasicInfo) {
      reset({
        ...watch(),
        first_name: userBasicInfo.first_name,
        last_name: userBasicInfo.last_name,
        official_personal_document_number: userBasicInfo.official_personal_document_number,
        date_of_birth: parseToDate(userBasicInfo.date_of_birth) ?? undefined,
        citizenship: countryOptions?.find(c => c.id === userBasicInfo.citizenship) || undefined,
        user_profile: {id: userBasicInfo.id, title: `${userBasicInfo.first_name} ${userBasicInfo.last_name}`},
        evaluation: userBasicInfo.evaluation,
      });
    }
  }, [userBasicInfo]);

  const resetForm = () => {
    reset({
      ...watch(),
      first_name: '',
      last_name: '',
      official_personal_document_number: '',
      date_of_birth: undefined,
      date_of_application: undefined,
      citizenship: undefined,
      user_profile: undefined,
      evaluation: undefined,
    });
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_application: parseToDate(selectedItem?.date_of_application),
        date_of_birth: parseToDate(selectedItem?.date_of_birth) ?? undefined,
        status: selectedItem?.status
          ? applicationStatusOptions.find(st => st.title === selectedItem?.status)
          : undefined,
        type: selectedItem?.type ? applicationTypeOptions.find(st => st.id === selectedItem?.type) : undefined,
        evaluation: selectedItem?.evaluation
          ? settingsData.find(st => st.title === selectedItem?.evaluation.title)
          : undefined,
        citizenship: selectedItem?.citizenship
          ? countryOptions?.find(st => st.id === selectedItem.citizenship)
          : undefined,
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (status?.id === 'accepted' && type?.id === 'external' && selectedItem?.status !== 'Izabran') {
      setConfirmationModal(true);
    }
  }, [status]);

  useEffect(() => {
    if (type?.id === 'external') {
      setValue('user_profile', undefined as any);
      setSelectedIdUser(0);
    }
  }, [type]);

  useEffect(() => {
    if (user_profile) {
      const item = userOptions.find(user => user.id === user_profile.id);

      if (item) {
        setSelectedIdUser(item.id);
      }
    }
  }, [user_profile]);

  const countryOptions = useMemo(() => {
    return countries?.map(country => {
      return {
        id: country.alpha3,
        title: country.name,
      };
    });
  }, [countries]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
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
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    label="TIP KANDIDATA:"
                    name={name}
                    options={
                      jobTender?.type?.title === 'Dobrovoljno trajno raspoređivanje' ||
                      jobTender?.type?.title === 'Javni oglas za napredovanje'
                        ? applicationTypeOptions.filter(option => option.title === 'Interni')
                        : applicationTypeOptions
                    }
                    value={value}
                    onChange={e => {
                      onChange(e);
                      // Reset form when user manually changes candidate type.
                      resetForm();
                    }}
                    error={errors.type?.message}
                    isRequired
                    isDisabled={!!selectedItem?.id}
                  />
                )}
              />
              <Controller
                name="user_profile"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    label="PRETRAGA:"
                    name={name}
                    options={userOptions}
                    isSearchable={true}
                    value={value as any}
                    onChange={onChange}
                    isDisabled={!!selectedItem?.id || type?.id === 'external'}
                    error={errors.user_profile?.message}
                    isRequired
                    placeholder="Unesite ime"
                  />
                )}
              />
            </Row>
            <Row>
              <Input
                {...register('first_name', {required: 'Ovo polje je obavezno'})}
                label="IME:"
                disabled={type?.id === 'internal'}
                isRequired
                error={errors.first_name?.message as string}
              />

              <Input
                {...register('last_name', {required: 'Ovo polje je obavezno'})}
                label="PREZIME:"
                disabled={type?.id === 'internal'}
                isRequired
                error={errors.last_name?.message as string}
              />
            </Row>
            <Row>
              <Input
                {...register('official_personal_document_number', {required: 'Ovo polje je obavezno'})}
                label="BROJ LIČNE KARTE:"
                error={errors.official_personal_document_number?.message as string}
                isRequired
                disabled={type?.id === 'internal'}
              />

              <Controller
                name="date_of_birth"
                control={control}
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="DATUM ROĐENJA:"
                    name={name}
                    selected={value}
                    error={errors.date_of_birth?.message as string}
                    isRequired
                    disabled={type?.id === 'internal'}
                  />
                )}
              />
            </Row>
            <RowFullWidth>
              <Controller
                name="citizenship"
                rules={type?.id !== 'internal' ? {required: 'Ovo polje je obavezno'} : {}}
                control={control}
                render={({field: {onChange, name, value}}) => {
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={value as any}
                      name={name}
                      style={{width: '100%'}}
                      label="NACIONALNOST:"
                      options={countryOptions || []}
                      error={errors.citizenship?.message as string}
                      isDisabled={type?.id === 'internal'}
                      isRequired
                      isSearchable
                    />
                  );
                }}
              />
            </RowFullWidth>
            <RowFullWidth>
              <Controller
                name="evaluation"
                control={control}
                render={({field: {onChange, name, value}}) => {
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={value as any}
                      name={name}
                      style={{width: '100%'}}
                      label="OCJENA:"
                      options={settingsData}
                      isRequired
                      isDisabled={
                        jobTender?.type?.title !== 'Javni oglas za predsjednika suda' || type?.id !== 'external'
                      }
                    />
                  );
                }}
              />
            </RowFullWidth>

            {type?.id === 'internal' && status?.id === ApplicationStatusEnum.ACCEPTED && (
              <>
                <Row>
                  <Controller
                    name="date_of_start"
                    control={control}
                    render={({field: {onChange, name, value}}) => (
                      <Datepicker onChange={onChange} label="POČETAK RADNOG ODNOSA:" name={name} selected={value} />
                    )}
                  />
                  <Controller
                    name="date_of_election"
                    control={control}
                    render={({field: {onChange, name, value}}) => (
                      <Datepicker onChange={onChange} label="DATUM IZBORA:" name={name} selected={value} />
                    )}
                  />
                </Row>
                <Row>
                  <Controller
                    name="date_of_oath"
                    control={control}
                    render={({field: {onChange, name, value}}) => (
                      <Datepicker onChange={onChange} label="DATUM POLAGANJA ZAKLETVE:" name={name} selected={value} />
                    )}
                  />
                  <Input {...register('number_of_assembly')} label="BROJ SJEDNICE:" />
                </Row>
              </>
            )}
            <Row>
              <Controller
                name="date_of_application"
                control={control}
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="DATUM PRIJAVE:"
                    name={name}
                    selected={value}
                    isRequired
                    error={errors.date_of_application?.message as string}
                    minDate={jobTender?.date_of_start ? new Date(jobTender?.date_of_start) : undefined}
                  />
                )}
              />

              {selectedItem?.id && (
                <Controller
                  name="status"
                  rules={{required: 'Ovo polje je obavezno'}}
                  control={control}
                  render={({field: {onChange, name, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value as any}
                        name={name}
                        label="STATUS:"
                        options={applicationStatusOptions || []}
                        error={errors.status?.message as string}
                        placeholder="Odaberite status"
                      />
                    );
                  }}
                />
              )}
            </Row>
          </ModalContentWrapper>
        }
        title={selectedItem ? 'IZMIJENI KANDIDATA' : 'DODAJTE NOVOG KANDIDATA'}
      />
      <Modal
        open={confirmationModal}
        onClose={toggleConfirmModal}
        width={450}
        leftButtonText="Otkaži"
        rightButtonText="Nastavi"
        leftButtonOnClick={toggleConfirmModal}
        rightButtonOnClick={handleSubmit(onSubmit)}
        content={
          <ConfirmModalContent>
            <TriangleIcon />
            <Typography
              content="Da li želite kreirati korisnički profil za ovog kandidata?"
              variant="bodyLarge"
              style={{fontWeight: 600}}
            />
            <Typography
              content={'Ukoliko odaberete opciju nastavi, bićete upućeni na stranicu za dodavanje novog zaposlenog.'}
              variant="bodySmall"
              style={{textAlign: 'center'}}
            />
          </ConfirmModalContent>
        }
      />
    </>
  );
};

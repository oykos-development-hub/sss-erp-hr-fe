import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {
  applicationStatusOptions,
  applicationTypeOptions,
  evaluationTypeOptions,
} from '../../screens/jobTenders/constants';
import useJobTenderApplicationsInsert from '../../services/graphql/jobTenders/useJobTenderApplicationInsert';
import useBasicInfoGet from '../../services/graphql/userProfile/basicInfo/useBasicInfoGet';
import useUserProfiles from '../../services/graphql/userProfile/useUserProfiles';
import {DropdownDataString} from '../../types/dropdownData';
import {JobTenderApplication, JobTenderApplicationInsertParams} from '../../types/graphql/jobTenders';
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
  official_personal_id: yup.string().required('Ovo polje je obavezno'),
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
});

export interface JobTenderApplicationModalModalProps extends ScreenProps {
  selectedItem?: JobTenderApplication;
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  countries?: any[];
  jobTenderId: number;
  alert: any;
  context: MicroserviceProps;
}

export const JobTenderApplicationModal: React.FC<JobTenderApplicationModalModalProps> = ({
  selectedItem,
  open,
  onClose,
  refetchList,
  countries,
  jobTenderId,
  alert,
  context,
}) => {
  const [selectedUserId, setSelectedIdUser] = useState<number>(0);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  const {data: userData} = useBasicInfoGet(selectedUserId);

  const {userProfiles} = useUserProfiles({page: 1, size: 1000});

  const citizenshipArray = useMemo(() => {
    return countries?.map(country => {
      return {
        id: country.alpha3,
        title: country.name,
      };
    });
  }, [countries]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {type: {id: 'internal', title: 'Interni'}},
    resolver: yupResolver(tenderApplicationSchema),
  });

  const {status, type, user_profile} = watch();

  const {mutate, loading: isSaving} = useJobTenderApplicationsInsert();

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const data: JobTenderApplicationInsertParams = {
      type: values.type.id,
      date_of_application: parseDateForBackend(values?.date_of_application) ?? '',
      status: values?.status?.title,
      job_tender_id: jobTenderId,
      active: true,
    };

    if (values?.id) data.id = values?.id;
    if (data.type === 'external') {
      // data.evaluation = values?.evaluation?.id;
      data.first_name = values.first_name;
      data.last_name = values.last_name;
      data.citizenship = values?.citizenship?.id;
      data.date_of_birth = parseDateForBackend(values?.date_of_birth) ?? '';
      data.official_personal_id = values?.official_personal_id;
    } else {
      data.user_profile_id = values?.user_profile?.id;
    }

    try {
      mutate(
        data,
        () => {
          context.alert.success('Uspješno sačuvano.');
          refetchList();
          onClose();
          reset();
          if (data.status === 'Izabran' && data.type === 'external') {
            navigateToUserCreation();
          }
        },
        () => {
          context.alert.error('Greška. Promjene nisu sačuvane.');
          onClose();
          reset();
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const userOptions = useMemo(
    () =>
      userProfiles && userProfiles
        ? [...userProfiles.map(item => ({...item, title: `${item.first_name} ${item.last_name}`}))]
        : [],
    [userProfiles],
  );

  const toggleConfirmModal = () => {
    setConfirmationModal(prev => !prev);
  };

  const navigateToUserCreation = () => {
    const {first_name, last_name, date_of_birth, evaluation, citizenship, official_personal_id} = watch();

    context.navigation.navigate('/hr/employees/add-new', {
      state: {user: {first_name, last_name, date_of_birth, evaluation, citizenship, official_personal_id}},
    });
  };

  // Choosing an internal user to populate the corresponding fields.
  useEffect(() => {
    if (userData) {
      reset({
        ...watch(),
        first_name: userData.first_name,
        last_name: userData.last_name,
        official_personal_id: userData.official_personal_id,
        date_of_birth: parseToDate(userData.date_of_birth) ?? undefined,
        citizenship: citizenshipArray?.find(c => (c.id = userData.citizenship)) || undefined,
        user_profile: {id: userData.id, title: `${userData.first_name} ${userData.last_name}`},
      });
    }
  }, [userData]);

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
          ? evaluationTypeOptions.find(st => st.id === selectedItem?.evaluation)
          : undefined,
        citizenship: selectedItem?.citizenship
          ? citizenshipArray?.find(st => st.id === selectedItem.citizenship)
          : undefined,
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (status?.id === 'accepted' && type?.id === 'external') {
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
                    options={applicationTypeOptions}
                    value={value}
                    onChange={onChange}
                    error={errors.type?.message}
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
                error={errors.first_name?.message as string}
              />

              <Input
                {...register('last_name', {required: 'Ovo polje je obavezno'})}
                label="PREZIME:"
                disabled={type?.id === 'internal'}
                error={errors.last_name?.message as string}
              />
            </Row>
            <Row>
              <Input
                {...register('official_personal_id', {required: 'Ovo polje je obavezno'})}
                label="BROJ LIČNE KARTE:"
                error={errors.official_personal_id?.message as string}
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
                      label="DRŽAVLJANSTVO:"
                      options={countryOptions || []}
                      error={errors.citizenship?.message as string}
                      isDisabled={type?.id === 'internal'}
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
                      options={evaluationTypeOptions || []}
                      isDisabled
                    />
                  );
                }}
              />
            </RowFullWidth>
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
                    error={errors.date_of_application?.message as string}
                  />
                )}
              />
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
            </Row>
          </ModalContentWrapper>
        }
        title={'DODAJTE NOVOG KANDIDATA'}
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

import {Datepicker, Dropdown, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  applicationStatusOptions,
  applicationTypeOptions,
  evaluationTypeOptions,
} from '../../screens/jobTenders/constants';
import useJobTenderApplicationsInsert from '../../services/graphql/jobTenders/useJobTenderApplicationInsert';
import useBasicInfoGet from '../../services/graphql/userProfile/basicInfo/useBasicInfoGet';
import useUserProfiles from '../../services/graphql/userProfile/useUserProfiles';
import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import {JobTenderApplication, JobTenderApplicationInsertParams} from '../../types/graphql/jobTenders';
import {UserProfile} from '../../types/graphql/userProfiles';
import {ScreenProps} from '../../types/screen-props';
import {
  ConfirmModalContent,
  ModalContentWrapper,
  Row,
  RowFullWidth,
  TriangleIcon,
} from '../JobTenderApplicationModal/styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {MicroserviceProps} from '../../types/micro-service-props';

interface JobTenderApplicationForm {
  id: number;
  type: DropdownDataString | null;
  file_id: number;
  status: DropdownDataString | null;
  job_tender: DropdownDataNumber | null;
  user_profile: DropdownDataNumber | null;
  first_name: string;
  last_name: string;
  official_personal_id: string;
  date_of_birth: Date | null;
  citizenship: DropdownDataString | null;
  evaluation: DropdownDataString | null;
  date_of_application: Date | null;
}

const initialValues: JobTenderApplicationForm = {
  id: 0,
  type: {id: 'internal', title: 'Interni'},
  file_id: 0,
  status: {id: 'waiting', title: 'Na čekanju'},
  job_tender: null,
  user_profile: null,
  first_name: '',
  last_name: '',
  official_personal_id: '',
  date_of_birth: null,
  citizenship: null,
  evaluation: null,
  date_of_application: null,
};

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
  ...props
}) => {
  const [selectedUserId, setSelectedIdUser] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<UserProfile>();
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [applicationType, setApplicationType] = useState<{id: 'external' | 'internal'; title: string}>({
    id: 'internal',
    title: 'Interni',
  });
  const {data: userData} = useBasicInfoGet(selectedUserId);

  const {data: userListData} = useUserProfiles({page: 1, size: 1000});

  const citizenshipArray = useMemo(() => {
    return countries?.map(country => {
      return {
        id: country.alpha_3_code,
        title: country.nationality,
      };
    });
  }, [countries]);

  const item = useMemo(() => {
    if (selectedItem?.type === 'external') setApplicationType({id: 'external', title: 'Eksterni'});
    return selectedItem
      ? {
          ...selectedItem,
          date_of_application: parseToDate(selectedItem?.date_of_application),
          date_of_birth: parseToDate(selectedItem?.date_of_birth),
          status: selectedItem?.status ? applicationStatusOptions.find(st => st.title === selectedItem?.status) : null,
          type: selectedItem?.type ? applicationTypeOptions.find(st => st.id === selectedItem?.type) : null,
          evaluation: selectedItem?.evaluation
            ? evaluationTypeOptions.find(st => st.id === selectedItem?.evaluation)
            : null,
          citizenship: selectedItem?.citizenship
            ? citizenshipArray?.find(st => st.title === selectedItem.citizenship)
            : null,
        }
      : initialValues;
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm({defaultValues: item || initialValues});

  const type = watch('type');
  const status = watch('status');
  const first_name = watch('first_name');
  const last_name = watch('last_name');
  const date_of_birth = watch('date_of_birth');
  const citizenship = watch('citizenship');
  const official_personal_id = watch('official_personal_id');
  const evaluation = watch('evaluation');

  const {mutate} = useJobTenderApplicationsInsert();

  const onChangeSearchable = (value: any) => {
    const item = userOptions.find(user => user.id === value.id);

    if (item) {
      setSelectedIdUser(item.id);
      setSelectedUser(item);
    }
  };

  const onChangeType = (value: any) => {
    reset({
      ...item,
      user_profile: null,
    });
    setSelectedIdUser(0);
    setSelectedUser(undefined);
    setApplicationType(value);
  };

  const onSubmit = (values: any) => {
    const data: JobTenderApplicationInsertParams = {
      type: applicationType.id,
      date_of_application: parseDateForBackend(values?.date_of_application),
      status: values?.status?.title,
      job_tender_id: jobTenderId,
      active: true,
    };

    if (values?.id) data.id = values?.id;
    if (data.type === 'external') {
      data.evaluation = values?.evaluation?.id;
      data.first_name = first_name;
      data.last_name = last_name;
      data.citizenship = values?.citizenship?.title;
      data.date_of_birth = parseDateForBackend(values?.date_of_birth);
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
          reset(item);
          if (data.status === 'Izabran') {
            navigateToUserCreation();
          }
        },
        () => {
          context.alert.error('Greška. Promjene nisu sačuvane.');
          onClose();
          reset(item);
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const userOptions = useMemo(
    () =>
      userListData
        ? [...userListData.items.map(item => ({...item, title: `${item.first_name} ${item.last_name}`}))]
        : [],
    [userListData],
  );

  const toggleConfirmModal = () => {
    setConfirmationModal(prev => !prev);
  };

  const navigateToUserCreation = () => {
    context.navigation.navigate('/hr/employees/add-new', {
      state: {user: {first_name, last_name, date_of_birth, evaluation, citizenship, official_personal_id}},
    });
  };

  // When the modal is opened, the fields are populated with the selected item.
  useEffect(() => {
    if (item) reset(item);
  }, [item]);

  // Choosing an internal user to populate the corresponding fields.
  useEffect(() => {
    if (userData) {
      reset({
        ...item,
        first_name: userData.first_name,
        last_name: userData.last_name,
        official_personal_id: userData.official_personal_id,
        date_of_birth: parseToDate(userData.date_of_birth),
        citizenship: citizenshipArray?.find(c => (c.id = userData.citizenship)) || null,
        user_profile: {id: userData.id, title: `${userData.first_name} ${userData.last_name}`},
      });
    }
  }, [userData]);

  useEffect(() => {
    if (status?.id === 'accepted' && type?.id === 'external') {
      setConfirmationModal(true);
    }
  }, [status]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        leftButtonText="Otkaži"
        rightButtonText="Sačuvaj"
        rightButtonOnClick={handleSubmit(onSubmit)}
        content={
          <ModalContentWrapper>
            <Row>
              <Dropdown
                label="TIP KANDIDATA:"
                name="type"
                options={applicationTypeOptions as any}
                value={applicationType as any}
                onChange={onChangeType}
                error={errors.type?.message as string}
              />

              <Dropdown
                label="PRETRAGA:"
                name={'searchable'}
                options={userOptions as any}
                isSearchable={true}
                value={selectedUser as any}
                onChange={value => onChangeSearchable(value)}
                isDisabled={applicationType.id === 'external'}
                placeholder="Unesite ime"
              />
            </Row>
            <Row>
              <Input
                {...register('first_name', {required: 'Ovo polje je obavezno'})}
                label="IME:"
                disabled={applicationType.id === 'internal'}
                error={errors.first_name?.message as string}
              />

              <Input
                {...register('last_name', {required: 'Ovo polje je obavezno'})}
                label="PREZIME:"
                disabled={applicationType.id === 'internal'}
                error={errors.last_name?.message as string}
              />
            </Row>
            <Row>
              <Input
                {...register('official_personal_id', {required: 'Ovo polje je obavezno'})}
                label="BROJ LIČNE KARTE:"
                error={errors.official_personal_id?.message as string}
                disabled={applicationType.id === 'internal'}
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
                    disabled={applicationType.id === 'internal'}
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
                      options={citizenshipArray || []}
                      error={errors.citizenship?.message as string}
                      isDisabled={applicationType.id === 'internal'}
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
        title={'DODAJTE NOVI OGLAS'}
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
            <Typography content="Promjena statusa u prihvaćen" variant="bodyLarge" style={{fontWeight: 600}} />
            <Typography
              content={`Ukoliko kliknete nastavi, bićete upućeni na stranu dodavanje novog zaposlenog ${selectedUser?.first_name} ${selectedUser?.last_name} da bi ste mogli da prebacite njegov status u prihvaćen.`}
              variant="bodySmall"
            />
          </ConfirmModalContent>
        }
      />
    </>
  );
};

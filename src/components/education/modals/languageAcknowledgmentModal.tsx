import {Dropdown, FileUpload, Modal} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import useInsertEducation from '../../../services/graphql/userProfile/education/useInsertEducation';
import {educationTypes, initialValues, languageAcknowledgmentLevels} from './constants';
import {ModalContentWrapper, Row} from './styles';

export const LanguageAcknowledgmentModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {settingsData} = useGetSettings({entity: educationTypes.education_language_types});

  const item = useMemo(
    () =>
      selectedItem
        ? {
            ...selectedItem,
            expertise_level: {
              id: selectedItem.expertise_level || '',
              title: selectedItem?.expertise_level || '',
            },
          }
        : initialValues,
    [selectedItem],
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item});

  const {insertEducation, loading: isSaving} = useInsertEducation();

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: null,
      price: values.price,
      date_of_start: null,
      date_of_end: null,
      expertise_level: values.expertise_level.id,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[4]),
      score: '',
    };

    try {
      insertEducation(
        data,
        () => {
          alert?.success('Uspješno sačuvano');
          refetchList && refetchList();
          onClose();
        },
        () => {
          alert.error('Greška. Promjene nisu sačuvane.');
          onClose();
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    item && reset(item);
  }, [item]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{width: '560px'}}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <Row>
            <Controller
              name="type"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="ZNANJE STRANOG JEZIKA:"
                  isSearchable
                  options={settingsData}
                  error={errors.type?.message as string}
                  isRequired
                />
              )}
            />
            <Controller
              name="expertise_level"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="STEPEN:"
                  options={languageAcknowledgmentLevels}
                  error={errors.expertise_level?.message as string}
                  isRequired
                />
              )}
            />
            <FileUpload
              icon={<></>}
              style={{border: 'none', padding: '0px', width: 'auto'}}
              variant="primary"
              onUpload={item => console.log(item)}
              buttonText="Učitaj"
            />
          </Row>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVI JEZIK'}
    />
  );
};

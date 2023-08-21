import {CheckIcon, Dropdown, FileUpload, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import {educationTypes, initialValues, languageAcknowledgmentLevels} from './constants';
import {ModalContentWrapper, Row} from './styles';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';

export const LanguageAcknowledgmentModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {data: languages} = useSettingsDropdownOverview(educationTypes.education_language_types);
  const languagesOptions = useMemo(
    () => languages?.map(type => ({id: type.id as number, title: type.title})) || [],
    [languages],
  );

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

  const {mutate} = useEducationInsert();

  const onSubmit = async (values: any) => {
    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: '',
      price: values.price,
      date_of_start: '',
      date_of_end: '',
      expertise_level: values.expertise_level.id,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[3]),
    };

    try {
      mutate(
        data,
        () => {
          alert?.success('Uspješno sačuvano');
          refetchList && refetchList();
          onClose();
        },
        () => {
          alert.error('Nije uspješno sačuvano');
          onClose();
        },
      );
    } catch (e) {
      console.log(e);
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
                  options={languagesOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.type?.message as string}
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
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.expertise_level?.message as string}
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

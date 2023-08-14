import {CheckIcon, Dropdown, FileUpload, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import {UserProfileEducationFormValues, UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {languageAcknowledgmentLevels} from './constants';
import {ModalContentWrapper, Row} from './styles';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';

const initialValues: UserProfileEducationFormValues = {
  id: 0,
  title: '',
  user_profile_id: 1,
  education_type_id: 2,
  date_of_certification: '',
  price: 0,
  date_of_start: '',
  date_of_end: '',
  academic_title: '',
  expertise_level: '',
  certificate_issuer: '',
  description: '',
  file_id: null,
};

interface LanguageAcknowledgmentModalProps extends ModalProps {
  alert: any;
  refetch: () => void;
}

export const LanguageAcknowledgmentModal: React.FC<LanguageAcknowledgmentModalProps> = ({
  selectedItem,
  open,
  onClose,
  dropdownData,
  alert,
  refetch,
}) => {
  const languagesList: any[] = [];

  dropdownData?.forEach(item => {
    const language = {
      id: item.alpha_3_code + '(' + item.en_short_name + ')',
      title: item.alpha_3_code + '(' + item.en_short_name + ')',
    };
    languagesList.push(language);
  });

  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          expertise_level: {
            id: selectedItem?.expertise_level ? selectedItem.expertise_level : '',
            title: selectedItem?.expertise_level ? selectedItem?.expertise_level : '',
          },
          academic_title: {
            id: selectedItem?.academic_title ? selectedItem.academic_title : '',
            title: selectedItem?.academic_title ? selectedItem.academic_title : '',
          },
        }
      : initialValues;
  }, [selectedItem]);

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item || initialValues});

  const {mutate} = useEducationInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    const data = {...values, academic_title: values.academic_title.id, expertise_level: values.expertise_level.id};

    if (!selectedItem) {
      delete data.id;
    }

    try {
      mutate(
        data,
        () => {
          alert?.success('Uspješno sačuvano');
          refetch();
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
              name="academic_title"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="ZNANJE STRANOG JEZIKA:"
                  isSearchable
                  options={languagesList}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.academic_title?.message as string}
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

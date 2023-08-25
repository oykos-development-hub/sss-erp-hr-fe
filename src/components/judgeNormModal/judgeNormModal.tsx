import {CheckIcon, Datepicker, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Norms} from '../../types/graphql/judges';
import {parseDate} from '../../utils/dateUtils';
import {ModalContentWrapper, Row} from '../education/modals/styles';
import {ModalProps} from '../../screens/employees/education/types';
import useJudgeNormsInsert from '../../services/graphql/judges/useJudgeNormInsert';
import {topicOptions} from '../../screens/judges/constants';

const initialValues: Norms = {
  id: 0,
  title: '',
  user_profile_id: 0,
  number_of_norm_decrease: 0,
  number_of_items: 0,
  number_of_items_solved: 0,
  evaluation_id: 0,
  relocation_id: 0,
  date_of_evaluation: '',
  date_of_evaluation_validity: '',
  topic: '',
};

const JudgeNormModal: React.FC<ModalProps> = ({alert, refetchList, open, onClose, selectedItem, dropdownData}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          user_profile_id: selectedItem.user_profile_id,
          user_profile:
            selectedItem.user_profile_id != 0
              ? dropdownData?.find(user => user.id === selectedItem.user_profile_id)
              : undefined,
          topic: selectedItem.topic ? topicOptions?.find(item => item.title === selectedItem.topic) : undefined,
          area: selectedItem?.area ? topicOptions.find(i => i.title === selectedItem.area) : '',
        }
      : initialValues;
  }, [selectedItem]);

  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item || initialValues});

  const {mutate} = useJudgeNormsInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    try {
      await mutate(
        {
          id: values?.id,
          title: values?.title,
          user_profile_id: values?.user_profile?.id,
          topic: values?.topic?.title,
          number_of_norm_decrease: values?.number_of_norm_decrease || 1,
          number_of_items: values?.number_of_items || 1,
          number_of_items_solved: values?.number_of_items_solved || 1,
          evaluation_id: values?.evaluation?.id || 1,
          relocation_id: values?.relocation?.id || 1,
          date_of_evaluation: parseDate(values?.date_of_start, true) || '',
          date_of_evaluation_validity: parseDate(values?.date_of_end, true) || '',
        },
        () => {
          refetchList && refetchList();
          reset();
          alert.success('Uspješno sačuvano');
          onClose();
        },
        () => {
          alert.error('Greška pri čuvanju podataka');
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(item);
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <ModalContentWrapper>
          <Row>
            <Controller
              name="user_profile"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="SUDIJA:"
                  name={name}
                  options={dropdownData as any}
                  value={value as any}
                  onChange={onChange}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.user_profile_id?.message as string}
                />
              )}
            />
            <Input
              {...register('number_of_norm_decrease', {required: 'Ovo polje je obavezno'})}
              label="UMANJEJE NORME:"
              error={errors.number_of_norm_decrease?.message as string}
            />
          </Row>
          <Row>
            <Controller
              name="topic"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="MATERIJA:"
                  name={name}
                  options={topicOptions as any}
                  value={value as any}
                  onChange={onChange}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.topic?.message as string}
                />
              )}
            />
            <Input
              {...register('number_of_items', {required: 'Ovo polje je obavezno'})}
              label="BROJ PREDMETA:"
              error={errors.number_of_items?.message as string}
            />
          </Row>
          <Row>
            <Input
              {...register('title', {required: 'Ovo polje je obavezno'})}
              label="NORMA:"
              error={errors.norm?.message as string}
            />
            <Input
              {...register('number_of_items_solved', {required: 'Ovo polje je obavezno'})}
              label="RIJEŠENO PREDMETA:"
              error={errors.number_of_items_solved?.message as string}
            />
          </Row>
          <Row>
            <Controller
              name="date_of_start"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM POČETKA:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.start_date?.message as string}
                />
              )}
            />
            <Controller
              name="date_of_end"
              control={control}
              rules={{
                required: 'Ovo polje je obavezno',
                validate: value =>
                  !value || !watch('date_of_start') || new Date(value) >= new Date(watch('date_of_start'))
                    ? true
                    : 'Datum kraja ne može biti prije datuma početka.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM KRAJA:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.end_date?.message as string}
                />
              )}
            />
          </Row>
        </ModalContentWrapper>
      }
      title={'NORMA'}
    />
  );
};

export default JudgeNormModal;

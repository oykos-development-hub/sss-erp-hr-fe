import {CheckIcon, Datepicker, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Norms} from '../../types/graphql/judges';
import {parseDate} from '../../utils/dateUtils';
import {ModalContentWrapper, Row} from '../education/modals/styles';
import {ModalProps} from '../../screens/employees/education/types';
import {areaItems} from '../../screens/judges/constants';
import useJudgeNormsInsert from '../../services/graphql/judges/useJudgeNormInsert';

const initialValues: Norms = {
  id: 0,
  user_profile_id: 0,
  topic: null,
  norm: 0,
  number_of_norm_decrease: '',
  number_of_items: 0,
  number_of_items_solved: 0,
  start_date: '',
  end_date: '',
};

const JudgeNormModal: React.FC<ModalProps> = ({alert, refetchList, open, onClose, selectedItem, dropdownData}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          user_profile_id:
            selectedItem.user_profile_id != 0
              ? dropdownData?.find(user => user.id === selectedItem.user_profile_id)
              : undefined,
          area: selectedItem?.area ? areaItems.find(i => i.title === selectedItem.area) : '',
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
          ...values,
          user_profile_id: values?.user_profile_id?.id,
          area: values?.area?.title,
          start_date: parseDate(values?.start_date, true) || '',
          end_date: parseDate(values?.end_date, true) || '',
        },
        () => {
          refetchList && refetchList();
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
              name="user_profile_id"
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
                  options={areaItems as any}
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
              {...register('norm', {required: 'Ovo polje je obavezno'})}
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
              name="start_date"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM POČETKA:"
                  name={name}
                  value={value ? parseDate(value) : ''}
                  error={errors.start_date?.message as string}
                />
              )}
            />
            <Controller
              name="end_date"
              control={control}
              rules={{
                required: 'Ovo polje je obavezno',
                validate: value =>
                  !value || !watch('start_date') || new Date(value) >= new Date(watch('start_date'))
                    ? true
                    : 'Datum kraja ne može biti prije datuma početka.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM KRAJA:"
                  name={name}
                  value={value ? parseDate(value) : ''}
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

import {Dropdown, Input, Modal} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../screens/employees/education/types';
import {topicOptions} from '../../screens/judges/constants';
import useJudgeNormsInsert from '../../services/graphql/judges/useJudgeNormInsert';
import {JudgeNormForm, Norms} from '../../types/graphql/judges';
import {ModalContentWrapper, Row} from '../education/modals/styles';
import {parseDateForBackend} from '../../utils/dateUtils';

const initialValues: JudgeNormForm = {
  id: 0,
  title: '',
  user_profile_id: null,
  number_of_norm_decrease: 0,
  number_of_items: 0,
  number_of_items_solved: 0,
  evaluation_id: 0,
  relocation_id: 0,
  date_of_evaluation: null,
  date_of_evaluation_validity: null,
  topic: null,
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
          topic: selectedItem.topic ? topicOptions?.find(item => item.title === selectedItem.topic) : undefined,
        }
      : initialValues;
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: initialValues});

  const {mutate, loading: isSaving} = useJudgeNormsInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    if (isSaving) return;

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
          date_of_evaluation: parseDateForBackend(values?.date_of_start),
          date_of_evaluation_validity: parseDateForBackend(values?.date_of_end),
        },
        () => {
          refetchList && refetchList();
          reset();
          alert.success('Uspješno sačuvano.');
          onClose();
        },
        () => {
          alert.error('Greška. Promjene nisu sačuvane.');
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
      buttonLoading={isSaving}
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
                  error={errors.user_profile_id?.message as string}
                />
              )}
            />
            <Input
              {...register('number_of_norm_decrease', {
                required: 'Ovo polje je obavezno',
                min: {value: 0, message: 'Najmanji broj je 0'},
                max: {value: 100, message: 'Najveći broj je 100'},
              })}
              label="UMANJENJE NORME %:"
              error={errors.number_of_norm_decrease?.message as string}
              type="number"
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
              error={errors.title?.message as string}
            />
            <Input
              {...register('number_of_items_solved', {required: 'Ovo polje je obavezno'})}
              label="RIJEŠENO PREDMETA:"
              error={errors.number_of_items_solved?.message as string}
            />
          </Row>
        </ModalContentWrapper>
      }
      title={selectedItem?.id ? 'IZMJENA NORME' : 'DODAJ NORMU'}
    />
  );
};

export default JudgeNormModal;

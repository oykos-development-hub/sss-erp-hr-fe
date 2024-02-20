import {yupResolver} from '@hookform/resolvers/yup';
import {Dropdown, Input, Modal, Datepicker} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {ModalProps} from '../../screens/employees/education/types';
import {topicOptions} from '../../screens/judges/constants';
import useInsertJudgeNorm from '../../services/graphql/judges/norms/useInsertJudgeNorm';
import {parseDateForBackend} from '../../utils/dateUtils';
import {ModalContentWrapper, Row} from '../education/modals/styles';
import {JudgeNormForm} from '../../types/graphql/judgeNorms';

const initialValues: JudgeNormForm = {
  id: 0,
  title: '',
  user_profile_id: null,
  number_of_norm_decrease: null,
  number_of_items: null,
  number_of_items_solved: null,
  evaluation_id: null,
  relocation_id: null,
  date_of_evaluation: null,
  date_of_evaluation_validity: null,
  topic: null,
  norm_start_date: '',
  norm_end_date: '',
};

const schema = yup.object().shape({
  user_profile_id: yup.object().required('Ovo polje je obavezno'),
  number_of_norm_decrease: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Ovo polje je obavezno')
    .min(0, 'Najmanji broj je 0')
    .max(100, 'Najveći broj je 100'),
  topic: yup.object().required('Ovo polje je obavezno'),
  title: yup.string().required('Ovo polje je obavezno'),
  number_of_items_solved: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Ovo polje je obavezno'),
  norm_start_date: yup.string().required('Ovo polje je obavezno'),
  norm_end_date: yup.string().required('Ovo polje je obavezno'),
});

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
    watch,
  } = useForm({resolver: yupResolver(schema)});

  const {insertJudgeNorm, loading: isSaving} = useInsertJudgeNorm();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    try {
      await insertJudgeNorm(
        {
          id: values?.id,
          title: values?.title,
          user_profile_id: values?.user_profile_id?.id,
          topic: values?.topic?.title,
          number_of_norm_decrease: values?.number_of_norm_decrease || 1,
          number_of_items: values?.number_of_items || 1,
          number_of_items_solved: values?.number_of_items_solved || 1,
          evaluation_id: null,
          relocation_id: values?.relocation?.id || null,
          date_of_evaluation: parseDateForBackend(values?.date_of_start),
          date_of_evaluation_validity: parseDateForBackend(values?.date_of_end),
          norm_start_date: parseDateForBackend(values.norm_start_date),
          norm_end_date: parseDateForBackend(values.norm_end_date),
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
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="SUDIJA:"
                  name={name}
                  options={dropdownData as any}
                  value={value as any}
                  onChange={onChange}
                  isRequired
                  error={errors.user_profile_id?.message as string}
                />
              )}
            />
            <Input
              {...register('number_of_norm_decrease')}
              label="UMANJENJE NORME %:"
              isRequired
              error={errors.number_of_norm_decrease?.message as string}
              type="number"
              value={watch('number_of_norm_decrease')?.toString()}
            />
          </Row>
          <div style={{marginBottom: '20px'}}>
            <Controller
              name="topic"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="MATERIJA:"
                  name={name}
                  options={topicOptions as any}
                  value={value as any}
                  onChange={onChange}
                  isRequired
                  error={errors.topic?.message as string}
                />
              )}
            />
          </div>
          <Row>
            <Input {...register('title')} label="NORMA:" error={errors.title?.message as string} isRequired />
            <Input
              {...register('number_of_items_solved')}
              label="RIJEŠENO PREDMETA:"
              isRequired
              error={errors.number_of_items_solved?.message as string}
              type="number"
              value={watch('number_of_items_solved')?.toString()}
            />
          </Row>
          <Row>
            <div style={{width: '100%'}}>
              <Controller
                name="norm_start_date"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    label="TRAJANJE NORME OD:"
                    name={name}
                    selected={value ? new Date(value) : null}
                    onChange={onChange}
                    isRequired
                    error={errors.user_profile_id?.message as string}
                  />
                )}
              />
            </div>
            <div style={{width: '100%'}}>
              <Controller
                name="norm_end_date"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    label="TRAJANJE NORME DO:"
                    name={name}
                    selected={value ? new Date(value) : null}
                    onChange={onChange}
                    isRequired
                    error={errors.user_profile_id?.message as string}
                  />
                )}
              />
            </div>
          </Row>
        </ModalContentWrapper>
      }
      title={selectedItem?.id ? 'IZMJENA NORME' : 'DODAJTE NORMU'}
    />
  );
};

export default JudgeNormModal;

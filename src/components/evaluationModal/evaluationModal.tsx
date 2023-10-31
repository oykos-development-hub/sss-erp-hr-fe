import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Modal, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yesOrNoOptionsString} from '../../constants';
import {EvaluationModalProps} from '../../screens/employees/evaluations/types';
import useEvaluationInsert from '../../services/graphql/userProfile/evaluation/useInsertEvaluation';
import {DropdownDataNumber} from '../../types/dropdownData';
import {ProfileEvaluationFormValues, ProfileEvaluationParams} from '../../types/graphql/evaluations';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {FileUploadWrapper, FormWrapper, Row} from './styles';

const evaluationSchema = yup.object().shape({
  date_of_evaluation: yup.date().required('Ovo polje je obavezno'),
  is_relevant: yup
    .object()
    .shape({id: yup.string().required(), title: yup.string().required()})
    .required('Ovo polje je obavezno')
    .nullable(),
  evaluation_type_id: yup
    .object()
    .shape({id: yup.number().required(), title: yup.string().required()})
    .required('Ovo polje je obavezno')
    .nullable(),
  user_profile_id: yup.number().required('Ovo polje je obavezno'),
});

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  alert,
  refetchList,
  selectedItem,
  open,
  onClose,
  userProfileId,
  evaluationTypes,
}) => {
  const [evaluationTypesOption, setEvaluationTypesOption] = useState<DropdownDataNumber[]>([]);

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(evaluationSchema),
    defaultValues: {user_profile_id: Number(userProfileId) ?? null},
  });

  useEffect(() => {
    if (Array.isArray(evaluationTypes) && evaluationTypes.length > 0) {
      const newData = evaluationTypes.map(item => ({id: item.id || 0, title: item.title || ''}));
      setEvaluationTypesOption(newData);
    }
  }, [evaluationTypes]);

  const {insertEvaluation, loading: isSaving} = useEvaluationInsert();

  const onSubmit = async (data: ProfileEvaluationFormValues) => {
    if (isSaving) return;

    const payload: ProfileEvaluationParams = {
      id: data.id ? data.id : 0,
      user_profile_id: data.user_profile_id,
      evaluation_type_id: data.evaluation_type_id?.id ?? 0,
      is_relevant: data.is_relevant?.id === 'Da' ? true : false,
      date_of_evaluation: parseDateForBackend(data?.date_of_evaluation),
    };

    await insertEvaluation(
      payload,
      () => {
        refetchList();
        alert.success('Uspješno sačuvano.');
        onClose();
        reset();
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        is_relevant: {id: selectedItem?.is_relevant ? 'Da' : 'Ne', title: selectedItem?.is_relevant ? 'Da' : 'Ne'},
        date_of_evaluation: parseToDate(selectedItem?.date_of_evaluation),
        score: {id: selectedItem?.evaluation_type.id, title: selectedItem?.evaluation_type.title},
        user_profile_id: Number(userProfileId),
      });
    }
  }, [selectedItem]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="date_of_evaluation"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  selected={value ? new Date(value) : ''}
                  name={name}
                  label="DATUM:"
                  error={errors.date_of_evaluation?.message}
                />
              )}
            />
            <Controller
              name="is_relevant"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="PRAVOSNAŽNOST:"
                    options={yesOrNoOptionsString}
                    error={errors.is_relevant?.message}
                  />
                );
              }}
            />
          </Row>
          <Row>
            <Controller
              name="evaluation_type_id"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="OCJENA:"
                    options={evaluationTypesOption}
                    error={errors.evaluation_type_id?.message}
                  />
                );
              }}
            />
          </Row>

          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={(item: File | FileList) => console.log(item)}
              note={<Typography variant="bodySmall" content="Validacija" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </FormWrapper>
      }
      title={'DODAJTE NOVU LIČNU OCJENU'}
    />
  );
};

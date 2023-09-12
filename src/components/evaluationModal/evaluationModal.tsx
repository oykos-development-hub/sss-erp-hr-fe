import {Datepicker, Dropdown, FileUpload, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {yesOrNoOptionsString} from '../../constants';
import {EvaluationModalProps} from '../../screens/employees/evaluations/types';
import useEvaluationInsert from '../../services/graphql/userProfile/evaluation/useEvaluationInsert';
import {DropdownDataNumber} from '../../types/dropdownData';
import {UserProfileEvaluation, UserProfileEvaluationFormValues} from '../../types/graphql/userProfileGetEvaluations';
import {FileUploadWrapper, FormWrapper, Row} from './styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';

const initialValues: UserProfileEvaluationFormValues = {
  id: 0,
  user_profile_id: 0,
  date_of_evaluation: null,
  score: '',
  evaluator: '',
  is_relevant: false,
  file_id: 0,
  evaluation_type_id: 1,
};

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

  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          is_relevant: {id: selectedItem?.is_relevant ? 'Da' : 'Ne', title: selectedItem?.is_relevant ? 'Da' : 'Ne'},
          date_of_evaluation: parseToDate(selectedItem?.date_of_evaluation),
          score: {id: selectedItem?.evaluation_type.id, title: selectedItem?.evaluation_type.title},
          user_profile_id: Number(userProfileId),
        }
      : {...initialValues, user_profile_id: Number(userProfileId)};
  }, [selectedItem]);

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item || initialValues});

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  useEffect(() => {
    if (Array.isArray(evaluationTypes) && evaluationTypes.length > 0) {
      const newData = evaluationTypes.map(item => ({id: item.id || 0, title: item.title || ''}));
      setEvaluationTypesOption(newData);
    }
  }, [evaluationTypes]);

  const {mutate, loading: isSaving} = useEvaluationInsert();

  const onSubmit = async (data: any) => {
    if (isSaving) return;

    const payload: any = {
      user_profile_id: data?.user_profile_id,
      score: data?.score.title,
      is_relevant: data?.is_relevant?.id === 'Da' ? true : false,
      date_of_evaluation: parseDateForBackend(data?.date_of_evaluation),
      file_id: data?.file_id,
      evaluation_type_id: data?.score.id,
      evaluator: '',
    };

    if (item) {
      payload.id = item.id ? item.id : 0;
    }

    await mutate(
      payload,
      () => {
        refetchList();
        alert.success('Uspješno sačuvano.');
        onClose();
        reset(initialValues);
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(initialValues);
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
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  selected={value ? new Date(value) : ''}
                  name={name}
                  label="DATUM:"
                  error={errors.date_of_evaluation?.message as string}
                />
              )}
            />
            <Controller
              name="is_relevant"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="PRAVOSNAŽNOST:"
                    options={yesOrNoOptionsString}
                    error={errors.is_relevant?.message as string}
                  />
                );
              }}
            />
          </Row>
          <Row>
            <Controller
              name="score"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="OCJENA:"
                    options={evaluationTypesOption}
                    error={errors.is_relevant?.message as string}
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
      title={'DODAJTE NOVO ZAPOSLENJE'}
    />
  );
};

import React, {useEffect, useMemo, useState} from 'react';
import {Typography, Modal, FileUpload, Dropdown, Datepicker} from 'client-library';
import {FileUploadWrapper, FormWrapper, Row} from './styles';
import {Controller, useForm} from 'react-hook-form';
import {EvaluationModalProps} from '../../screens/employees/evaluations/types';
import {yesOrNoOptionsString} from '../../constants';
import useEvaluationInsert from '../../services/graphql/userProfile/evaluation/useEvaluationInsert';
import {UserProfileEvaluationFormValues} from '../../types/graphql/userProfileGetEvaluations';
import {parseDate} from '../../utils/dateUtils';
import {DropdownDataNumber} from '../../types/dropdownData';

const initialValues: UserProfileEvaluationFormValues = {
  id: 0,
  user_profile_id: 0,
  date_of_evaluation: '',
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
          date_of_evaluation: new Date(selectedItem?.date_of_evaluation),
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
      let newData = evaluationTypes.map(item => ({id: item.id || 0, title: item.title || ''}));
      setEvaluationTypesOption(newData);
    }
  }, [evaluationTypes]);

  const {mutate} = useEvaluationInsert();

  const onSubmit = async (data: any) => {
    const payload: UserProfileEvaluationFormValues = {
      user_profile_id: data?.user_profile_id,
      score: data?.score.title,
      is_relevant: data?.is_relevant?.id === 'Da' ? true : false,
      date_of_evaluation: parseDate(data?.date_of_evaluation, true),
      file_id: data?.file_id,
      // Where does this come from??
      evaluation_type_id: data?.score.id,
      evaluator: ' ',
    };

    if (item) {
      payload.id = item.id ? item.id : 0;
    }

    await mutate(
      payload,
      () => {
        refetchList();
        alert.success('Uspješno sačuvano');
        onClose();
      },
      () => {
        alert.error('Greška pri čuvanju podataka');
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
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
                  value={value ? parseDate(value) : ''}
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

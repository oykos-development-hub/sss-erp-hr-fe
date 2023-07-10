import React, {useEffect, useMemo} from 'react';
import {Typography, Modal, FileUpload, Dropdown} from 'client-library';
import {FileUploadWrapper, FormWrapper, Row} from './styles';
import {formatData} from '../../screens/employees/evaluations/utils';
import {Controller, useForm} from 'react-hook-form';
import {EvaluationModalProps} from '../../screens/employees/evaluations/types';
import {yesOrNoOptionsString} from '../../constants';
import useEvaluationInsert from '../../services/graphql/userProfile/evaluation/useEvaluationInsert';

const initialValues = {
  id: 0,
  user_profile_id: 0,
  date_of_evaluation: '',
  score: '',
  evaluator: '',
  is_relevant: false,
  file_id: 1,
};

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  alert,
  refetchList,
  selectedItem,
  open,
  onClose,
  years,
  userProfileId,
}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
        ...selectedItem,
        is_relevant: {id: selectedItem?.is_relevant ? 'Da' : 'Ne', title: selectedItem?.is_relevant ? 'Da' : 'Ne'},
        date_of_evaluation: {id: selectedItem?.date_of_evaluation, title: selectedItem?.date_of_evaluation},
        score: {id: selectedItem?.score, title: selectedItem?.score},
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

  const {mutate} = useEvaluationInsert(
    () => {
      refetchList();
      alert.success('Uspješno sačuvano');
      onClose();
    },
    () => {
      alert.error('Greška pri čuvanju podataka');
    },
  );

  const onSubmit = async (data: any) => {
    const payload = formatData(data);
    await mutate(payload);
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
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="GODINA:"
                  options={years}
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
                    options={[
                      {id: 'los', title: 'Loš'},
                      {id: 'dobar', title: 'Dobar'},
                      {id: 'vrlo dobar', title: 'Vrlo dobar'},
                      {id: 'odlican', title: 'Odličan'},
                    ]}
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

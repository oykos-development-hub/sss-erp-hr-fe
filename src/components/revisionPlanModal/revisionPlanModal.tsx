import {Dropdown, Input} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useRevisionPlanDetails from '../../services/graphql/revisionsPlans/useRevisionPlanDetails';
import useRevisionPlanInsert from '../../services/graphql/revisionsPlans/useRevisionPlanInsert';
import {yearsForDropdown} from '../../utils/constants';
import {FormGroup, ModalForm, ModalSection, RevisionModal} from './styles';

interface RevisionPlanProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
}

const InitialValues = {
  name: '',
  year: '',
};

export const RevisionPlanModal: React.FC<RevisionPlanProps> = ({open, onClose, alert, refetchList, id}) => {
  const {data: planDetails} = useRevisionPlanDetails(id);
  const {mutate, loading: isSaving} = useRevisionPlanInsert();

  const yearOptions = yearsForDropdown(1).map(year => ({id: year.id, title: year.title}));

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
  } = useForm({defaultValues: planDetails || InitialValues});

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const data = {
      ...values,
      name: values?.name,
      year: values?.year.id.toString(),
    };

    mutate(
      data,
      () => {
        refetchList();
        onClose();
        reset(InitialValues);
        alert.success(planDetails.item.id ? 'Plan uspješno sačuvan.' : 'Plan je uspešno dodat.');
      },
      () => {
        alert.error(
          planDetails.item.id
            ? 'Došlo je do greške prilikom izmjene plana.'
            : 'Došlo je do greške prilikom dodavanja plana.',
        );
      },
    );
  };

  useEffect(() => {
    if (planDetails && planDetails.item && id && planDetails.status === 'success') {
      reset({
        name: planDetails.item.name,
        id: planDetails.item.id,
        year: yearOptions.find(yearOption => yearOption.title === planDetails?.item.year),
      });
    }
  }, [planDetails]);

  return (
    <RevisionModal
      onClose={() => onClose()}
      open={open}
      title={'DODAJ PLAN'}
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      content={
        <ModalForm>
          <ModalSection>
            <FormGroup>
              <Controller
                control={control}
                name="year"
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={yearOptions || []}
                    error={errors.year?.message as string}
                    placeholder="Izaberite godinu"
                    label="GODINA"
                  />
                )}
              />
            </FormGroup>
            <FormGroup>
              <Input
                {...register('name', {required: 'Ovo polje je obavezno'})}
                label="NAZIV PLANA"
                placeholder="Unesite naziv"
                error={errors.name?.message as string}
              />
            </FormGroup>
          </ModalSection>
        </ModalForm>
      }
    />
  );
};

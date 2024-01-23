import {Dropdown, Input} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useGetRevisionPlanDetails from '../../services/graphql/revisionsPlans/useRevisionPlanDetails';
import useInsertRevisionPlan from '../../services/graphql/revisionsPlans/useRevisionPlanInsert';
import {RevisionPlanForm} from '../../types/graphql/revisionPlans';
import {yearsForDropdown} from '../../utils/constants';
import {FormGroup, ModalForm, ModalSection, RevisionModal} from './styles';

interface RevisionPlanProps {
  open: boolean;
  onClose: () => void;
  refetchList: () => void;
  alert: any;
  id: number;
}

const initialValues: RevisionPlanForm = {
  id: null,
  name: '',
  year: null,
};

export const RevisionPlanModal: React.FC<RevisionPlanProps> = ({open, onClose, alert, refetchList, id}) => {
  const {revisionPlanDetails} = useGetRevisionPlanDetails(id);
  const {insertRevisionPlan, loading: isSaving} = useInsertRevisionPlan();

  const yearOptions = yearsForDropdown(1).map(year => ({id: year.id, title: year.title}));

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
  } = useForm({defaultValues: initialValues});

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const data = {
      ...values,
      name: values?.name,
      year: values?.year.id.toString(),
    };

    insertRevisionPlan(
      data,
      () => {
        refetchList();
        onClose();
        reset(initialValues);
        alert.success(revisionPlanDetails.id ? 'Plan uspješno sačuvan.' : 'Plan je uspešno dodat.');
      },
      () => {
        alert.error(
          revisionPlanDetails.id
            ? 'Došlo je do greške prilikom izmjene plana.'
            : 'Došlo je do greške prilikom dodavanja plana.',
        );
      },
    );
  };

  useEffect(() => {
    if (revisionPlanDetails && id) {
      reset({
        name: revisionPlanDetails.name,
        id: revisionPlanDetails.id,
        year: yearOptions.find(yearOption => yearOption.title === revisionPlanDetails?.year),
      });
    }
  }, [revisionPlanDetails]);

  return (
    <RevisionModal
      onClose={() => onClose()}
      open={open}
      title={'DODAJTE PLAN'}
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
                    isRequired
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
                isRequired
                error={errors.name?.message as string}
              />
            </FormGroup>
          </ModalSection>
        </ModalForm>
      }
    />
  );
};

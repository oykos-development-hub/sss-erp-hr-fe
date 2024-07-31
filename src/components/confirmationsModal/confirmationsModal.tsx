import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {ConfirmationsModalProps} from '../../screens/employees/confirmations/types';
import useInsertResolution from '../../services/graphql/userProfile/resolution/useInsertResolution';
import {DropdownDataNumber} from '../../types/dropdownData';
import {parseDate, parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import useGetSettings from '../../services/graphql/settings/useGetSettings';
import {resolutionTypes} from '../education/modals/constants';
import {yesOrNoOptionsString} from '../../constants';
import {yearsForDropdown} from '../../utils/constants.ts';
import useGetVacations from '../../services/graphql/userProfile/vacation/useGetVacation.ts';
import {generateDocxDocument} from './docx.ts';
import {saveAs} from 'file-saver';
import useAppContext from '../../context/useAppContext.ts';
import {AnnualLeavePartIDecisionDocumentProps} from './types.ts';
import {generateDocumentSerialNumber} from '../../utils/documentGenerationUtils.ts';
import useGetBasicInfo from '../../services/graphql/userProfile/basicInfo/useGetBasicInfo.ts';

const confirmationSchema = yup.object().shape({
  resolution_purpose: yup.string(),
  date_of_start: yup.date().test('date_of_start-required', 'Ovo polje je obavezno', function (value) {
    const resolutionType = this.parent.resolution_type;
    if (resolutionType && resolutionType.title !== 'Rješenje o godišnjem odmoru') {
      return !!value;
    }
    return true;
  }),
  resolution_type: yup.object().required('Ovo polje je obavezno'),
  is_affect: yup
    .object()
    .default(undefined)
    .shape({id: yup.string(), title: yup.string()})
    .test('is_affect-required', 'Ovo polje je obavezno', function (value) {
      const resolutionType = this.parent.resolution_type;
      if (resolutionType && resolutionType.title !== 'Rješenje o godišnjem odmoru') {
        return !!value?.id;
      }
      return true;
    }),
  year: yup
    .object()
    .shape({id: yup.number(), title: yup.number()})
    .test('year-required', 'Ovo polje je obavezno', function (value) {
      const resolutionType = this.parent.resolution_type;
      if (resolutionType && resolutionType.title === 'Rješenje o korišćenju I dijela godišnjeg odmora') {
        return !!value?.id;
      }
      return true;
    }),
  value: yup.string(),
});

export const ConfirmationsModal: React.FC<ConfirmationsModalProps> = ({
  selectedItem,
  open,
  onClose,
  userProfileId,
  alert,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(confirmationSchema),
  });

  const {settingsData} = useGetSettings({entity: resolutionTypes.resolution_types});
  const [files, setFiles] = useState<FileList | null>(null);
  const resolutionType = watch('resolution_type') as DropdownDataNumber;
  const year = watch('year');
  const yearOptions = useMemo(() => [...yearsForDropdown().map(year => ({id: +year.id, title: +year.title}))], []);
  const handleUpload = (files: FileList) => {
    setFiles(files);
  };

  const {insertResolution, loading: isSaving} = useInsertResolution();
  const {vacations} = useGetVacations(userProfileId);
  const {
    contextMain: {first_name: current_user_first_name, last_name: current_user_last_name},
    fileService: {uploadFile},
  } = useAppContext();
  const {userBasicInfo} = useGetBasicInfo(userProfileId, {skip: !userProfileId});
  const {first_name, last_name, organization_unit, job_position} = userBasicInfo || {};
  const isResolutionTypeAnnualLeaveIPart = resolutionType?.title === 'Rješenje o korišćenju I dijela godišnjeg odmora';

  const vacationForSelectedYear = () => {
    if (!vacations?.length || !year?.id || !isResolutionTypeAnnualLeaveIPart) {
      return;
    }
    const vacationForSelectedYear = vacations.find(vacation => vacation.year === year?.id);

    if (!vacationForSelectedYear) {
      alert.error('Korisnik nema rješenje o godišnjem odmoru za odabranu godinu.');
      return;
    }
    return vacationForSelectedYear;
  };

  const generateDocument = () => {
    if (!vacations?.length || !year?.id || !isResolutionTypeAnnualLeaveIPart) {
      return;
    }

    const documentProps: AnnualLeavePartIDecisionDocumentProps = {
      // currently user profile id is used as id in serial number, that will probably change
      serialNumber: generateDocumentSerialNumber(userProfileId),
      date: parseDate(new Date(), '.'),
      year: year.id,
      numberOfDays: vacationForSelectedYear()?.number_of_days.toString() ?? '',
      fullName: `${first_name} ${last_name}`,
      jobTitle: job_position?.title ?? '',
      department: organization_unit?.title ?? '',
      currentUser: `${current_user_first_name} ${current_user_last_name}`,
    };

    generateDocxDocument(documentProps).then(blob => {
      saveAs(blob, `Rješenje_o_korišćenju_I_dijela_godišnjeg_odmora_${year.id}_${first_name}_${last_name}.docx`);
    });
  };

  const handleInsertResolution = async (data: any) => {
    insertResolution(
      data,
      () => {
        onClose(true);
        generateDocument();
        alert.success('Uspješno sačuvano.');
      },
      () => {
        onClose(true);
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const handleSave = async (value: any) => {
    if (isSaving || (isResolutionTypeAnnualLeaveIPart && !vacationForSelectedYear())) return;
    const payload = {
      ...value,
      id: value?.id || 0,
      user_profile_id: Number(userProfileId),
      date_of_start: parseDateForBackend(value?.date_of_start),
      date_of_end: null,
      file_id: value?.file_id || 0,
      resolution_purpose: value?.resolution_purpose || '',
      resolution_type_id: value?.resolution_type.id || null,
      is_affect: value?.is_affect?.id === 'Da',
      year: value?.year?.id || 0,
      value: value?.value,
    };

    delete payload.created_at;
    delete payload.updated_at;
    delete payload.resolution_type;
    delete payload.user_profile;
    delete payload.file;

    if (files) {
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(null);
          const updatedData = {...payload, file_id: res[0]?.id};
          handleInsertResolution(updatedData);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      handleInsertResolution(payload);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem?.date_of_end),
        date_of_start: parseToDate(selectedItem?.date_of_start),
        is_affect: {id: selectedItem?.is_affect ? 'Da' : 'Ne', title: selectedItem?.is_affect ? 'Da' : 'Ne'},
        year: {id: selectedItem?.year, title: selectedItem?.year},
        value: selectedItem?.value,
      });
    }
  }, [selectedItem]);

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(handleSave)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <FormGroup>
            {settingsData && (
              <Controller
                name="resolution_type"
                control={control}
                render={({field: {name, value}}) => (
                  <Dropdown
                    label="VRSTA:"
                    name={name}
                    options={settingsData}
                    value={value as any}
                    onChange={value => {
                      reset({resolution_type: value});
                    }}
                    error={errors.resolution_type?.message}
                    placeholder="Birajte vrstu"
                    isRequired
                    isDisabled={selectedItem?.resolution_type?.title === 'Rješenje o godišnjem odmoru'}
                  />
                )}
              />
            )}
          </FormGroup>
          {resolutionType?.title !== 'Rješenje o godišnjem odmoru' && (
            <>
              <FormGroup>
                <Controller
                  name="is_affect"
                  control={control}
                  render={({field: {onChange, name, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value as any}
                        name={name}
                        label="PRAVOSNAŽNOST:"
                        options={yesOrNoOptionsString}
                        error={errors.is_affect?.message}
                        placeholder="Izaberite pravosnažnost:"
                        isRequired
                      />
                    );
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Controller
                  name="date_of_start"
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange}
                      label="DATUM RJEŠENJA/POTVRDE:"
                      name={name}
                      selected={value}
                      error={errors.date_of_start?.message}
                      isRequired
                    />
                  )}
                />
              </FormGroup>
            </>
          )}
          {isResolutionTypeAnnualLeaveIPart && (
            <FormGroup>
              <Controller
                name="year"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="GODINA:"
                    name={name}
                    options={yearOptions}
                    value={value as any}
                    onChange={onChange}
                    isRequired
                    error={errors.year?.message as string}
                  />
                )}
              />
            </FormGroup>
          )}
          {resolutionType?.title === 'Rješenje o godišnjem odmoru' && (
            <FormGroup>
              <Input {...register('value')} label="PRIPADAJUĆI DANI GODIŠNJEG ODMORA:" />
            </FormGroup>
          )}
          <FormGroup>
            <Input {...register('resolution_purpose')} label="SVRHA:" placeholder="Unesite opis..." textarea />
          </FormGroup>

          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Validacija" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </ModalContentWrapper>
      }
      title={'SVRHA POTVRDE I RJEŠENJA'}
    />
  );
};

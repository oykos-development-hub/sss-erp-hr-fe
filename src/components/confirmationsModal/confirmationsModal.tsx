import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {ConfirmationsModalProps} from '../../screens/employees/confirmations/types';
import useInsertResolution from '../../services/graphql/userProfile/resolution/useInsertResolution';
import {DropdownDataNumber} from '../../types/dropdownData';
import {parseDate, parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
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
  date_of_start: yup.date().required('Ovo polje je obavezno'),
  resolution_type: yup.object().required('Ovo polje je obavezno'),
  is_affect: yup
    .object()
    .default(undefined)
    .shape({id: yup.string(), title: yup.string()})
    .required('Ovo polje je obavezno'),
  year: yup
    .object()
    .shape({id: yup.number(), title: yup.number()})
    .test('year-required', 'Ovo polje je obavezno', function (value) {
      const resolutionType = this.parent.resolution_type;
      if (resolutionType && resolutionType.id === 248) {
        return !!value.id;
      }
      return true;
    }),
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

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const resolutionType = watch('resolution_type') as DropdownDataNumber;
  const year = watch('year');
  const yearOptions = useMemo(() => [...yearsForDropdown().map(year => ({id: +year.id, title: +year.title}))], []);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const {insertResolution, loading: isSaving} = useInsertResolution();
  const {vacations} = useGetVacations(userProfileId);
  const {
    contextMain: {first_name: current_user_first_name, last_name: current_user_last_name},
  } = useAppContext();
  const {userBasicInfo} = useGetBasicInfo(userProfileId, {skip: !userProfileId});
  const {first_name, last_name, organization_unit, job_position} = userBasicInfo || {};
  const isResolutionTypeAnnualLeaveIPart = resolutionType?.id === 248;

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

  const handleSave = (value: any) => {
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
    };

    delete payload.created_at;
    delete payload.updated_at;
    delete payload.resolution_type;
    delete payload.user_profile;
    delete payload.year;

    insertResolution(
      payload,
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

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem?.date_of_end),
        date_of_start: parseToDate(selectedItem?.date_of_start),
        is_affect: {id: selectedItem?.is_affect ? 'Da' : 'Ne', title: selectedItem?.is_affect ? 'Da' : 'Ne'},
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
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="VRSTA:"
                    name={name}
                    options={settingsData}
                    value={value as any}
                    onChange={onChange}
                    error={errors.resolution_type?.message}
                    placeholder="Birajte vrstu"
                    isRequired
                  />
                )}
              />
            )}
          </FormGroup>
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

          {!!uploadedFiles.length && (
            <UploadedFileWrapper>
              {uploadedFiles.map((file, index) => (
                <UploadedFileContainer key={index}>
                  <Typography variant="bodySmall" content={file.name} />
                </UploadedFileContainer>
              ))}
            </UploadedFileWrapper>
          )}
        </ModalContentWrapper>
      }
      title={'SVRHA POTVRDE I RJEŠENJA'}
    />
  );
};

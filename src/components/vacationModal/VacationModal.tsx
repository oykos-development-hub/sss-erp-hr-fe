import {Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {VacationModalProps} from '../../screens/employees/absents/types';
import useVacationInsert from '../../services/graphql/userProfile/vacation/useInsertVacation';
import {yearsForDropdown} from '../../utils/constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
import {ProfileVacationParams} from '../../types/graphql/vacations';
import {generateDocxDocument} from './docx.ts';
import {saveAs} from 'file-saver';
import {AnnualLeaveDecisionDocumentProps} from './types.ts';
import {parseDate} from '../../utils/dateUtils.ts';
import useAppContext from '../../context/useAppContext.ts';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import useGetBasicInfo from '../../services/graphql/userProfile/basicInfo/useGetBasicInfo.ts';

const initialValues: ProfileVacationParams = {
  id: null,
  user_profile_id: null,
  file_id: null,
  number_of_days: null,
  year: null,
  resolution_purpose: '',
};

const vacationSchema = yup.object().shape({
  number_of_days: yup.number().required('Ovo polje je obavezno').typeError('Unešena vrijednost mora biti broj'),
  year: yup.object().shape({id: yup.number(), title: yup.number()}).required('Ovo polje je obavezno'),
});

export const VacationModal: React.FC<VacationModalProps> = ({selectedItem, open, onClose, userProfileId, alert}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const {
    contextMain: {first_name: current_user_first_name, last_name: current_user_last_name},
  } = useAppContext();

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const {userBasicInfo} = useGetBasicInfo(userProfileId, {skip: !userProfileId});
  const {insertVacation, loading} = useVacationInsert();

  const {first_name, last_name, organization_unit, job_position} = userBasicInfo || {};

  const handleSave = (values: any) => {
    const payload = {
      id: values.id,
      user_profile_id: userProfileId,
      year: values.year.id || 0,
      file_id: values.file_id,
      number_of_days: values.number_of_days,
      resolution_purpose: values.resolution_purpose,
    };

    const documentProps: AnnualLeaveDecisionDocumentProps = {
      // currently user profile id is used as id in serial number, that will probably change
      serialNumber: generateSerialNumber(userProfileId),
      date: parseDate(new Date(), '.'),
      year: values.year.id,
      numberOfDays: values.number_of_days,
      fullName: `${first_name} ${last_name}`,
      jobTitle: job_position?.title ?? '',
      department: organization_unit?.title ?? '',
      currentUser: `${current_user_first_name} ${current_user_last_name}`,
    };

    insertVacation(
      payload,
      () => {
        generateDocxDocument(documentProps).then((blob: any) => {
          saveAs(blob, `Rješenje_o_godišnjem_odmoru_${values.year.id}_${first_name}_${last_name}.docx`);
        });
        onClose(true);
        alert.success('Uspješno sačuvano.');
        reset();
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm<any>({defaultValues: initialValues, resolver: yupResolver(vacationSchema)});

  const generateSerialNumber = (id: number) => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}-${id}/${year}`;
  };

  useEffect(() => {
    reset({...selectedItem, year: yearOptions.find(yearOption => yearOption.id === selectedItem?.year)});
  }, [selectedItem]);

  const yearOptions = useMemo(() => [...yearsForDropdown().map(year => ({id: +year.id, title: +year.title}))], []);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(initialValues);
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(handleSave)}
      buttonLoading={loading}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="year"
              control={control}
              // rules={{required: 'Ovo polje je obavezno'}}
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

          <FormGroup>
            <Input
              {...register('number_of_days')}
              label="UKUPAN BROJ DANA:"
              isRequired
              error={errors.number_of_days?.message as string}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('resolution_purpose')} label="OPIS:" textarea />
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

          {uploadedFiles.length > 0 && (
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
      title={'Rješenje o godišnjem odmoru'}
    />
  );
};

import {Datepicker, Dropdown, FileUpload, Modal, Typography, Input} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import useInsertEducation from '../../../services/graphql/userProfile/education/useInsertEducation';
import {educationTypes, initialValues} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import {parseDateForBackend, parseToDate} from '../../../utils/dateUtils';
import {ProfileEducationFormValues} from '../../../types/graphql/education';
import useAppContext from '../../../context/useAppContext';
import { FileItem } from '../../../types/fileUploadType';
import FileList from '../../fileList/fileList';

export const JudicalAndStateExamsModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {settingsData} = useGetSettings({entity: educationTypes.education_exam_types});
  const [files, setFiles] = useState<FileList | null>(null);
  const [initialFiles, setInitialFiles] = useState<FileItem[]>([]);  
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false);

  const {
    fileService: {uploadFile, deleteFile},
  } = useAppContext();

  const item = useMemo(
    () =>
      selectedItem
        ? {
          ...selectedItem,
          academic_title: {
            id: selectedItem?.academic_title,
            title: selectedItem?.academic_title,
          },
        }
        : initialValues,
    [selectedItem],
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
    register,
    watch,
  } = useForm({defaultValues: initialValues});

  const {insertEducation, loading: isSaving} = useInsertEducation();

  useEffect(() => {
    if (item) {
      reset({...item, date_of_certification: parseToDate(item.date_of_certification)});
      setInitialFiles(item.files);
    } 
  }, [item]);

  const handleInsertEducation = async (data: any) => {
    await insertEducation(
      data,
      () => {
        alert.success('Uspješno sačuvano.');
        refetchList && refetchList();
        onClose();
        reset(initialValues);
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
        onClose();
      },
    );
  };

  const onSubmit = async (values: ProfileEducationFormValues) => {
    if (isSaving || isUploadingFiles) return;

    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: parseDateForBackend(values.date_of_certification),
      price: values.price,
      date_of_start: null,
      date_of_end: null,
      expertise_level: values.expertise_level,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[4]),
      score: values?.score,
      file_ids: initialFiles.map(file => file.id)
    };

    const hasFiles = (files?.length && files.length > 0);

    if (hasFiles) {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        setIsUploadingFiles(true);

        const formData = new FormData();

        formData.append('file', file);

        await uploadFile(
          formData,
          (res: any) => {
            data.file_ids.push(res[0]?.id);
            setIsUploadingFiles(false);
          },
          () => {
            setIsUploadingFiles(false);
            alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
          },
        );
      }

      setFiles(null);
    }

    handleInsertEducation(data);
    
    reset();
    deleteFiles();
  };

  const handleFileUpload = (files: FileList) => {
    setFiles(files);
    if (files.length > 0) {
      alert.success('Fajlovi uspješno učitani');
    }
  };

  const onFileRemove = (id: number) => {
    setInitialFiles(files => files.filter(file => file.id !== id));
  };

  const deleteFiles = async () => {
    for (const file of (selectedItem?.files) || []) {
      const fileDeleted = !initialFiles.some(file2 => file2.id === file.id);
      if (fileDeleted) {
        await deleteFile(
          file.id, 
        );
      }
    }
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
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="type"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="VRSTA ISPITA"
                  options={settingsData}
                  error={errors.type?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('score')} label="BROJ BODOVA:" type="number" value={watch('score')} />
          </FormGroup>
          <FormGroup>
            <Controller
              name="date_of_certification"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM POLAGANJA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_certification?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <FileUploadWrapper>
              <FileUpload
                icon={<></>}
                style={{width: '100%'}}
                variant="secondary"
                onUpload={handleFileUpload}
                note={<Typography variant="bodySmall" content="Obrazovni sertifikat" />}
                buttonText="Učitaj"
                files={files}
                multiple={true}
              />
            </FileUploadWrapper>
            {initialFiles && (
              <FileList onDelete={onFileRemove} files={initialFiles} />
            )}
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVI PRAVOSUDNI/DRŽAVNI ISPIT'}
    />
  );
};

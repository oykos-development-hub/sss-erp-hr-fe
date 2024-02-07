import {Modal, FileUpload} from 'client-library';
import React, {useState} from 'react';
import useAppContext from '../../context/useAppContext';
import useTerminateEmployment from '../../services/graphql/terminateEmployment/useTerminateEmployment';
import {ContractEndModalContent, CustomText, TriangleIcon} from './styles';
import {FileUploadWrapper} from '../absentsModal/styles.ts';
import FileList from '../fileList/fileList.tsx';
import {Typography} from '@oykos-development/devkit-react-ts-styled-components';
import {ContractEndModalProps} from './types.ts';

export const ContractEndModal: React.FC<ContractEndModalProps> = ({open, onClose, profileId, refetchUsers}) => {
  const {terminateEmployment, loading} = useTerminateEmployment();

  const {navigation, alert} = useAppContext();
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const [showFileUploadError, setShowFileUploadError] = useState<boolean>(false);
  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    setShowFileUploadError(false);
  };
  const {
    fileService: {uploadFile},
  } = useAppContext();

  const handleTerminateEmployment = (file_id: number) => {
    terminateEmployment(
      {user_profile_id: profileId, file_id},
      () => {
        onClose(true);
        alert.success('Radni odnos je uspješno prekinut.');
        refetchUsers && refetchUsers();
        navigation.navigate('/hr/employees/');
      },
      () => {
        alert.error('Došlo je do greške prilikom prekida radnog odnosa.');
      },
    );
  };

  const handleSave = async () => {
    if (loading) return;

    if (uploadedFile) {
      const formData = new FormData();
      const fileArray = Array.from(uploadedFile);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setUploadedFile(undefined);
          handleTerminateEmployment(res[0]?.id);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      setShowFileUploadError(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(true);
      }}
      width={450}
      leftButtonText="Prekini radni odnos"
      rightButtonText="Odustani"
      leftButtonOnClick={() => handleSave()}
      rightButtonOnClick={onClose}
      content={
        <ContractEndModalContent>
          <TriangleIcon />
          <CustomText content="Da li ste sigurni da želite prekinuti radni odnos zaposlenom?" variant="bodyLarge" />
          <div>
            <FileUploadWrapper>
              <FileUpload
                icon={null}
                files={uploadedFile}
                variant="secondary"
                onUpload={handleUpload}
                buttonText="Učitaj"
                note={<Typography variant="bodySmall" content="Prekid radnog odnosa" />}
                required={true}
                error={showFileUploadError ? 'Morate učitati fajl' : undefined}
              />
            </FileUploadWrapper>
          </div>
        </ContractEndModalContent>
      }
    />
  );
};

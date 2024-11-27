import { Modal } from 'client-library';
import useAppContext from '../../context/useAppContext';
import { useEffect, useState } from 'react';
import { FileItem } from './types';
import { ArrowLeftCircleIcon, ArrowLeftIcon, ArrowRightCircleIcon, Button, ControlIconWrapper, Typography } from '@oykos-development/devkit-react-ts-styled-components';
import { ControlIcon, ControlsWrapper, FileNameWrapper } from './styles';
import { allowedTypes } from '../fileList/fileList';

type FileModalViewProps = {
  onClose: () => void;
  files: FileItem[];
};

const MultiFileModalView = ({ onClose, files }: FileModalViewProps) => {
  const [open, setOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<string>('');

  const {
    fileService: { getFileBinary },
  } = useAppContext();

  const fetchFile = async (file: FileItem) => {
    const response = await getFileBinary(file.id);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    setFileUrl(blobUrl);
    setFileType(file.type);
    setOpen(true);
  };

  const handleClose = () => {
    setFileUrl('');
    setOpen(false);
    onClose();
  };

  const handlePrev = () => {
    const prevIndex = (currentFileIndex - 1 + files.length) % files.length;
    setCurrentFileIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentFileIndex + 1) % files.length;
    setCurrentFileIndex(nextIndex);
  };

  useEffect(() => {
    if (!allowedTypes.includes(files[currentFileIndex].type)) {
      const nextIndex = (currentFileIndex + 1) % files.length;
      setCurrentFileIndex(nextIndex);
      return; 
    }

    fetchFile(files[currentFileIndex]);

    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [currentFileIndex, files]);

  return (
    <Modal
      open={open && !!fileUrl}
      onClose={handleClose}
      customModalContent={
        <>
          <div style={{ display: 'flex', flexDirection: 'column', height: '95%', overflow: 'auto' }}>
            <FileNameWrapper>
              <Typography variant="bodyLarge" content="Naziv fajla:" style={{ fontWeight: 600 }} />
              <Typography variant="bodyLarge" content={files[currentFileIndex].name} />
            </FileNameWrapper>
            {fileType === '.pdf' ? (
              <embed
                src={fileUrl}
                width="100%"
                height="100%"
                type="application/pdf"
                style={{ border: 'none', objectFit: 'contain' }}
              />
            ) : (
              <img
                src={fileUrl}
                width={'100%'}
                height={'90%'}
                style={{
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'none',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
          <ControlsWrapper>
            <ControlIcon onClick={handlePrev}>
              <ArrowLeftCircleIcon width="30" height="30" />
            </ControlIcon>
            <ControlIcon onClick={handleNext}>
              <ArrowRightCircleIcon width="30" height="30" />
            </ControlIcon>
          </ControlsWrapper>
        </>
      }
      style={{ width: '80vw', height: '80vh' }}
      priority={2}
    />
  );
};

export default MultiFileModalView;

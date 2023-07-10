import React from 'react';
import {Modal, Typography, Button, FileUpload} from 'client-library';

interface ImportEmployeeModalProps {
  open: boolean;
  toggleEmployeeImportModal: () => void;
}

const ImportEmployeeModal: React.FC<ImportEmployeeModalProps> = ({open, toggleEmployeeImportModal}) => {
  return (
    <Modal
      open={open}
      onClose={toggleEmployeeImportModal}
      title="ZAPOSLENIK ZA UVOZ"
      leftButtonText="Otkaži"
      rightButtonText="Uvoz"
      content={
        <>
          <Typography content="Preuzmite datoteku predloška, ispunite je podacima svog zaposlenika i kada završite prenesite datoteku ovdje kako biste uvezli svoj tim." />
          <Button
            content="Preuzmite predložak"
            onClick={() => console.log('Preuzmite predložak')}
            variant="primary"
            style={{marginBlock: 20, width: '100%'}}
          />
          <FileUpload
            variant="primary"
            onUpload={() => console.log('On upload')}
            note="Kliknite ili povucite predložak sa svojim zaposlenicima u ovo područje za prijenos"
            buttonText="ODABERI DATOTEKU"
          />
        </>
      }
    />
  );
};

export default ImportEmployeeModal;

import React, {useState} from 'react';
import {DepartmentsProps} from '../../types';
import {
  AccordionHeader,
  AccordionIconsWrapper,
  Menu,
  MenuItem,
  SectorsContainer,
  OptionsIcon,
  JobPositionTableWrapper,
  AccordionWrapper,
} from './styles';
import {ChevronDownIcon, Typography, Accordion} from 'client-library';
import {JobPositionTable} from '../../../../components/jobPositionTable/jobPositionTable';
import {DeleteModal} from '../../../../shared/deleteModal/deleteModal';
import {SectorJobPosition, SectorType} from '../../../../types/graphql/systematizationsTypes';

const Departments: React.FC<DepartmentsProps> = ({
  sectors,
  handleDeleteSector,
  systematizationId,
  refreshData,
  handleEditSector,
  context,
  jobPositionData,
  allEmployees,
  activeEmployees,
  isInactive,
}) => {
  const [collapsedSectorId, setCollapsedSectorId] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);
  // const [addJob, setAddJob] = useState(false);

  const [jobPositions, setJobPositions] = useState<SectorJobPosition[]>([]);

  const toggleAccordion = (sectorId: number) => {
    // reset if same sector is clicked
    setSelectedItemId(sectorId === selectedItemId ? 0 : sectorId);

    const jobPositions = sectors?.find(
      (sector: SectorType) => sector?.id === sectorId,
    )?.job_positions_organization_units;

    setJobPositions(jobPositions || []);

    setCollapsedSectorId(0);
  };

  const toggleMenu = (sectorId: number) => {
    setCollapsedSectorId(prevState => (prevState === sectorId ? 0 : sectorId));
  };

  const addJobPosition = (e: MouseEvent, sector: SectorType) => {
    e.stopPropagation();

    setSelectedItemId(sector.id);
    setCollapsedSectorId(0);

    setJobPositions([
      {
        available_slots: 0,
        description: '',
        employees: [],
        id: 0,
        job_positions: {id: 0, title: ''},
        requirements: '',
        serial_number: '',
      },
      ...(selectedItemId ? jobPositions : sector.job_positions_organization_units),
    ]);
  };

  const cancelJobPosition = () => {
    // remove the first item from the array
    setJobPositions(jobPositions.slice(1));
  };

  const deleteSector = () => {
    handleDeleteSector(deleteItemId);
    setShowDeleteModal(false);
    setDeleteItemId(0);
  };

  return (
    <SectorsContainer>
      {sectors?.map((sector: SectorType) => {
        return (
          <AccordionWrapper
            isOpen={selectedItemId === sector?.id}
            key={`sector-${sector?.id}`}
            style={{position: 'relative'}}>
            <Accordion
              style={{border: 0, padding: 0, marginBottom: 15, display: 'block'}}
              isOpen={selectedItemId === sector?.id}
              customHeader={
                <AccordionHeader color={sector?.color}>
                  <Typography variant="bodyMedium" content={sector?.title} style={{fontWeight: 600}} />
                  <AccordionIconsWrapper isOpen={selectedItemId === sector?.id}>
                    <ChevronDownIcon
                      width="15px"
                      height="8px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        toggleAccordion(sector.id);
                      }}
                    />
                    {!isInactive && (
                      <OptionsIcon
                        onClick={(e: any) => {
                          e.stopPropagation();
                          toggleMenu(sector.id);
                        }}
                      />
                    )}
                  </AccordionIconsWrapper>
                  {!isInactive && (
                    <Menu open={collapsedSectorId === sector?.id}>
                      <MenuItem
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleEditSector(sector.id);
                          setCollapsedSectorId(0);
                        }}>
                        <Typography content="Uredi" variant="bodyMedium" />
                      </MenuItem>

                      <MenuItem onClick={(e: any) => addJobPosition(e, sector)}>
                        <Typography content="Dodaj radno mjesto" variant="bodyMedium" />
                      </MenuItem>

                      <MenuItem
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setShowDeleteModal(true);
                          setDeleteItemId(sector?.id);
                          setCollapsedSectorId(0);
                        }}>
                        <Typography content="Obriši" variant="bodyMedium" />
                      </MenuItem>
                    </Menu>
                  )}
                </AccordionHeader>
              }
              customContent={
                <JobPositionTableWrapper>
                  <JobPositionTable
                    data={jobPositions || []}
                    sectorID={sector?.id}
                    systematizationID={systematizationId}
                    refetch={availableSlotsChanged => refreshData && refreshData(availableSlotsChanged)}
                    alert={context?.alert}
                    jobPositionData={jobPositionData}
                    allEmployees={allEmployees}
                    activeEmployees={activeEmployees}
                    cancel={cancelJobPosition}
                    isInactive={isInactive}
                  />
                </JobPositionTableWrapper>
              }
            />
          </AccordionWrapper>
        );
      })}
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={deleteSector} />
    </SectorsContainer>
  );
};

export default Departments;

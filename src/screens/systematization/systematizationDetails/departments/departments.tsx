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
import {ConfirmModal} from '../../../../shared/confirmModal/confirmModal';
import {SectorJobPosition, SectorType} from '../../../../types/graphql/systematizationsTypes';

const Departments: React.FC<DepartmentsProps> = ({
  sectors,
  handleDeleteSector,
  systematizationId,
  refetchDetails,
  handleEditSector,
  jobPositionData,
  allEmployees,
  activeEmployees,
  isInactive,
}) => {
  const [collapsedSectorId, setCollapsedSectorId] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);

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
        const isCollapsed = selectedItemId === sector?.id;

        return (
          <AccordionWrapper isOpen={isCollapsed} key={`sector-${sector?.id}`} style={{position: 'relative'}}>
            <Accordion
              style={{border: 0, padding: 0, marginBottom: 15, display: 'block'}}
              isOpen={isCollapsed}
              customHeader={
                <AccordionHeader color={sector?.color}>
                  <Typography variant="bodyMedium" content={sector?.title} style={{fontWeight: 600}} />
                  <AccordionIconsWrapper isOpen={isCollapsed}>
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
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleEditSector(sector.id);
                          setCollapsedSectorId(0);
                        }}>
                        <Typography content="Uredi" variant="bodyMedium" />
                      </MenuItem>

                      <MenuItem onClick={(e: any) => addJobPosition(e, sector)}>
                        <Typography content="Dodajte radno mjesto" variant="bodyMedium" />
                      </MenuItem>

                      <MenuItem
                        onClick={(e: React.MouseEvent) => {
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
                isCollapsed ? (
                  <JobPositionTableWrapper>
                    <JobPositionTable
                      data={jobPositions || []}
                      sectorID={sector?.id}
                      systematizationID={systematizationId}
                      refetchDetails={refetchDetails}
                      jobPositionData={jobPositionData}
                      allEmployees={allEmployees}
                      activeEmployees={activeEmployees}
                      cancel={cancelJobPosition}
                      isInactive={isInactive}
                    />
                  </JobPositionTableWrapper>
                ) : (
                  <></>
                )
              }
            />
          </AccordionWrapper>
        );
      })}
      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={deleteSector} />
    </SectorsContainer>
  );
};

export default Departments;

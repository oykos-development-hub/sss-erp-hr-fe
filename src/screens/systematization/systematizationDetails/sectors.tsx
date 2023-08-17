import React, {useEffect, useState} from 'react';
import {SectorsProps} from '../types';
import {AccordionHeader, AccordionIconsWrapper, Menu, MenuItem, SectorsWrapper} from './styles';
import {Accordion, ChevronDownIcon, MoreVerticalIcon, Typography} from 'client-library';
import {SystematizationJobPositions} from '../../../types/graphql/jobPositions';
import {JobPositionTable} from '../../../components/jobPositionTable/jobPositionTable';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {SectorType} from '../../../types/graphql/systematizationsGetDetailsTypes';

export const Sectors: React.FC<SectorsProps> = ({
  sectors,
  handleDeleteSector,
  systematizationID,
  refreshData,
  handleEditSector,
  context,
  jobPositionData,
  allEmployees,
}) => {
  const [isOpen, setIsOpen] = useState<number>(0);
  const [showMenu, setShowMenu] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const [jobPositions, setJobPositions] = useState<SystematizationJobPositions[] | undefined>([]);

  const openAccordion = (sectorId: number) => {
    setIsOpen(prevState => (prevState === sectorId ? 0 : sectorId));
    setSelectedItemId(sectorId);
    setShowMenu(0);
  };

  const showMenuHandler = (sectorId: number) => {
    setShowMenu(prevState => (prevState === sectorId ? 0 : sectorId));
  };

  const addJobPosition = (e: any, sector: any) => {
    e.stopPropagation();
    setSelectedItemId(sector?.id);
    const jobPositions = sectors?.find(
      (sector: any) => sector?.id === selectedItemId,
    )?.job_positions_organization_units;
    debugger;
    setJobPositions(jobPositions);
    setShowMenu(0);
    jobPositions &&
      setJobPositions([
        ...jobPositions,
        {
          available_slots: 0,
          description: '',
          employees: [],
          id: 0,
          job_position: {id: 0, title: ''},
          requirements: '',
          serial_number: '',
        },
      ]);
  };

  const deleteSector = () => {
    handleDeleteSector(deleteItemId);
    setShowDeleteModal(false);
    setDeleteItemId(0);
  };

  useEffect(() => {
    if (selectedItemId) {
      const jobPositions = sectors?.find(
        (sector: any) => sector?.id === selectedItemId,
      )?.job_positions_organization_units;
      setJobPositions(jobPositions);
    }
  }, [selectedItemId]);

  return (
    <SectorsWrapper>
      {sectors?.map((sector: SectorType) => {
        return (
          <div key={`sector-${sector?.id}`} style={{position: 'relative'}}>
            <Accordion
              style={{border: 0, padding: 0, marginBottom: 20, display: 'block'}}
              isOpen={isOpen === sector?.id ? true : false}
              customHeader={
                <AccordionHeader color={sector?.color}>
                  <Typography
                    variant="bodyMedium"
                    content={`${sector?.id}. ${sector?.title}`}
                    style={{fontWeight: 600}}
                  />
                  <AccordionIconsWrapper isOpen={isOpen === sector?.id}>
                    <ChevronDownIcon
                      width="15px"
                      height="8px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        openAccordion(sector.id);
                      }}
                    />
                    <MoreVerticalIcon
                      width="5px"
                      height="16px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        showMenuHandler(sector.id);
                      }}
                      style={{padding: '10px'}}
                    />
                  </AccordionIconsWrapper>
                  <Menu open={showMenu === sector?.id}>
                    <MenuItem>
                      <Typography
                        content="Uredi"
                        variant="bodyMedium"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleEditSector(sector.id);
                          setShowMenu(0);
                        }}
                      />
                    </MenuItem>
                    <MenuItem>
                      <Typography
                        content="Dodaj radno mjesto"
                        variant="bodyMedium"
                        onClick={(e: any) => addJobPosition(e, sector)}
                      />
                    </MenuItem>
                    <MenuItem>
                      <Typography
                        content="Obriši"
                        variant="bodyMedium"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setShowDeleteModal(true);
                          setDeleteItemId(sector?.id);
                          setShowMenu(0);
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </AccordionHeader>
              }
              content={
                <JobPositionTable
                  data={jobPositions || []}
                  sectorID={sector?.id}
                  systematizationID={systematizationID}
                  refetch={availableSlotsChanged => refreshData && refreshData(availableSlotsChanged)}
                  alert={context?.alert}
                  jobPositionData={jobPositionData}
                  allEmployees={allEmployees}
                />
              }
            />
          </div>
        );
      })}
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={deleteSector} />
    </SectorsWrapper>
  );
};

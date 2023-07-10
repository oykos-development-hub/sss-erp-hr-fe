import {SectorType} from '../../types/graphql/systematizationsGetDetailsTypes';
import {MicroserviceProps} from '../../types/micro-service-props';

export interface SystematizationDetailsPageProps {
  context: MicroserviceProps;
}

export interface SectorsProps {
  sectors: SectorType[];
  handleDeleteSector: (id: number) => void;
  handleEditSector: (id: number) => void;
  systematizationID: number;
  refreshData?: (availableSlotsChanged?: boolean) => void;
  context?: MicroserviceProps;
}

export interface SystematizationFiltersProps {
  data?: any;
  context?: MicroserviceProps;
  setFilters: (filters: any) => void;
}

export interface PrintPageProps {
  sectorDetails: SectorType[];
}

export interface FooterProps {
  activeTab: number;
  handleSaveButton: () => void;
}

export interface SectorModalProps {
  open: boolean;
  onClose: () => void;
}

import {MicroserviceProps} from '../../types/micro-service-props';
import {JobPosition} from '../../types/graphql/jobPositions';
import {UserProfile} from '../../types/graphql/userProfiles';
import {ActiveEmployee, SectorType} from '../../types/graphql/systematizationsTypes';

export interface DepartmentsProps {
  sectors?: SectorType[];
  handleDeleteSector: (id: number) => void;
  handleEditSector: (id: number) => void;
  systematizationId: number;
  refetchDetails: () => void;
  context?: MicroserviceProps;
  jobPositionData: JobPosition[];
  allEmployees: UserProfile[];
  activeEmployees: ActiveEmployee[];
  isInactive: boolean;
}

export type SystematizationFilters = {
  organization_unit_id: number | null;
  search: string;
  year: string;
};

export interface SystematizationFiltersProps {
  setFilters: (name: string, value: string | number) => void;
  filters: SystematizationFilters;
}

export interface PrintPageProps {
  sectorDetails: SectorType[];
}

export interface FooterProps {
  activeTab: number;
  handleSaveButton: () => void;
  status?: number;
  id: number;
  uploadedFile?: FileList;
  file?: number;
  setError: (arg: boolean) => void;
}

export interface SectorModalProps {
  open: boolean;
  onClose: () => void;
}

export const systematizationStatuses = {
  draft: 0,
  inactive: 1,
  active: 2,
};

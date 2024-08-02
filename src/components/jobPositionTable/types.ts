import {JobPosition} from '../../types/graphql/jobPositions';
import {ActiveEmployee, SectorJobPosition} from '../../types/graphql/systematizationsTypes';
import {UserProfile} from '../../types/graphql/userProfiles';

export interface JobPositionTableProps {
  data: SectorJobPosition[];
  sectorID: number;
  systematizationID: number;
  refetchDetails: () => void;
  jobPositionData: JobPosition[];
  allEmployees: UserProfile[];
  activeEmployees: ActiveEmployee[];
  cancel?: () => void;
  isInactive: boolean;
  disableUpdate: boolean;
}

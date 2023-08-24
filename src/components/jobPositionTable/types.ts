import {JobPosition, SystematizationJobPositions} from '../../types/graphql/jobPositions';
import {UserProfile} from '../../types/graphql/userProfiles';

export interface JobPositionTableProps {
  data: SystematizationJobPositions[];
  sectorID: number;
  systematizationID: number;
  refetch?: (availableSlotsChanged?: boolean) => void;
  alert: any;
  jobPositionData: JobPosition[];
  allEmployees: UserProfile[];
  cancel?: () => void;
  isActive: boolean;
}

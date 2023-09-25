import {JobPosition, SystematizationJobPositions} from '../../types/graphql/jobPositions';
import {ActiveEmployees} from '../../types/graphql/systematizationsGetDetailsTypes';
import {UserProfile} from '../../types/graphql/userProfiles';

export interface JobPositionTableProps {
  data: SystematizationJobPositions[];
  sectorID: number;
  systematizationID: number;
  refetch?: (availableSlotsChanged?: boolean) => void;
  alert: any;
  jobPositionData: JobPosition[];
  allEmployees: UserProfile[];
  activeEmployees: ActiveEmployees[];
  cancel?: () => void;
  isInactive: boolean;
}

import {SystematizationJobPositions} from '../../types/graphql/jobPositions';

export interface JobPositionTableProps {
  data: SystematizationJobPositions[];
  sectorID: number;
  systematizationID: number;
  refetch?: (availableSlotsChanged?: boolean) => void;
  alert: any;
}

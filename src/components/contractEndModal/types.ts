export interface ContractEndModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  profileId: number;
  refetchUsers?: () => void;
}

import {ReactElement} from 'react';

export interface DeleteModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  handleDelete: (action?: any) => void;
  customContent?: string | ReactElement;
  message?: string;
  question?: string;
}

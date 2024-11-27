import {ValueType} from '@oykos-development/devkit-react-ts-styled-components';
import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {DeleteResponse, DetailsResponse, GetResponse, InsertResponse} from './response';
import {FileItem} from '../../components/fileModalView/types';

export type Revision = {
  id: number;
  title: string;
  year: string;
  plan_id: number;
  serial_number: string;
  date_of_revision: string;
  revision_quartal: string;
  internal_revision_subject: DropdownDataNumber[];
  external_revision_subject: DropdownDataNumber | null;
  revisor: DropdownDataNumber[];
  revision_type: DropdownDataNumber | null;
  files: FileItem[];
  tips_files: FileItem[];
};

export type RevisionInsertParams = {
  id: number;
  title: string;
  plan_id: number;
  serial_number: string;
  date_of_revision: string;
  revision_quartal: string;
  internal_revision_subject_id: number[] | null;
  external_revision_subject_id: number | null;
  revisor_id: number[];
  revision_type_id: number;
};

export type RevisionGetParams = {
  page: number;
  size: number;
  plan_id: number;
  internal_revision_subject_id: number;
  revision_type_id: number;
  revisor_id: number;
};

export type Revisors = {
  title: string;
  id: number;
};

export type RevisionResponse = {
  get: {revision_Overview: GetResponse<Revision> & {revisors: DropdownDataNumber[]}};
  details: {revision_Details: DetailsResponse<Revision>};
  insert: {revision_Insert: InsertResponse<Revision>};
  delete: {revision_Delete: DeleteResponse};
};

export type RevisionFormValues = {
  id?: number;
  title: string;
  plan_id: number;
  serial_number: string;
  date_of_revision: Date;
  revision_quartal: DropdownDataString;
  internal_revision_subject_id: ValueType[];
  external_revision_subject_id: DropdownDataNumber;
  revisor_id: ValueType[];
  revision_type_id: DropdownDataNumber;
};

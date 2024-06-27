import {DeleteResponse, GetResponse} from './response.ts';
import {DropdownDataNumber} from '../dropdownData.ts';
import {FileItem} from '../fileUploadType.ts';

export type Template = {
  id: number;
  template: DropdownDataNumber;
  organization_unit: DropdownDataNumber;
  file: FileItem;
};

export type TemplateResponse = {
  get: {template_Overview: GetResponse<Template>};
  insert: {template_Insert: DeleteResponse};
  delete: {template_Delete: DeleteResponse};
  update: {template_Update: DeleteResponse};
  updateItem: {templateItem_Update: DeleteResponse};
};

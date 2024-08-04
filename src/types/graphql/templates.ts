import {DeleteResponse, GetResponse} from './response.ts';
import {DropdownDataNumber} from '../dropdownData.ts';
import {FileTemplateItem} from '../fileUploadType.ts';

export type Template = {
  id: number;
  template: DropdownDataNumber;
  organization_unit: DropdownDataNumber;
  file: FileTemplateItem;
};

export type TemplateResponse = {
  get: {template_Overview: GetResponse<Template>};
  insert: {template_Insert: DeleteResponse};
  delete: {template_Delete: DeleteResponse};
  update: {template_Update: DeleteResponse};
  updateItem: {templateItem_Update: DeleteResponse};
};

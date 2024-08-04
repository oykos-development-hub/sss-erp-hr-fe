import {FileTemplateItem} from '../types/fileUploadType.ts';

const generateDynamicTemplate = async (
  file: FileTemplateItem,
  data: [string: string][],
  alert: any,
  fileService: any,
) => {
  const {getFileBinary, streamToArrayBuffer, replacePlaceholders} = fileService;

  return await getFileBinary(
    file.id,
    async (response: Response) => {
      if (response) {
        const templateArrayBuffer = await streamToArrayBuffer(response);
        const generatedTemplate = await replacePlaceholders(templateArrayBuffer, data, file.name, true);
        alert.success(`Šablon '${file.name}' je uspješno generisan i preuzet!`);

        return generatedTemplate;
      }
    },
    () => {
      alert.error('Došlo je do greške prilikom generisanja šablona.');

      return null;
    },
  );
};

export default generateDynamicTemplate;

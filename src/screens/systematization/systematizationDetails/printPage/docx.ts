import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  UnderlineType,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
  WidthType,
} from 'docx';
import {SystematizationDocumentProps, SystematizationTableRowProps} from './types.ts';
import {coatOfArmsBase64} from './coatOfArmsBase64.ts';

export const generateDocxDocument = async (props: SystematizationDocumentProps) => {
  const {date, organizationUnit, tableData} = props;
  const cellStyles = {
    centeredCell: {
      verticalAlign: VerticalAlign.TOP,
      margins: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      },
    },
    coloredCenteredCell: {
      verticalAlign: VerticalAlign.TOP,

      shading: {
        fill: '#A6A6A6', // Background color
      },
      margins: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      },
    },
  };

  const tableHeader = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({children: [new TextRun({text: 'Redni Broj'})], alignment: AlignmentType.CENTER})],
        width: {size: 15, type: WidthType.PERCENTAGE},
        ...cellStyles.coloredCenteredCell,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Naziv radnog mjesta, zvanje i uslovi za obavljanje poslova u\n' + 'određenom zvanju\n',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: {size: 35, type: WidthType.PERCENTAGE},
        ...cellStyles.coloredCenteredCell,
      }),
      new TableCell({
        children: [
          new Paragraph({children: [new TextRun({text: 'Broj\nizvrši\nlaca'})], alignment: AlignmentType.CENTER}),
        ],
        width: {size: 5, type: WidthType.PERCENTAGE},
        ...cellStyles.coloredCenteredCell,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({text: 'Opis'}), new TextRun({text: 'Poslova', break: 1})],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: {size: 45, type: WidthType.PERCENTAGE},
        ...cellStyles.coloredCenteredCell,
      }),
    ],
  });

  const generateJobRow = (props: SystematizationTableRowProps) => {
    const {serialNumber, jobTitle, jobRequirements, jobDescription, numberOfEmployees} = props;

    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({children: [new TextRun({text: serialNumber, bold: true})]})],
          width: {size: 15, type: WidthType.PERCENTAGE},
          ...cellStyles.coloredCenteredCell,
        }),
        new TableCell({
          children: [
            new Paragraph({
              spacing: {
                before: 0,
              },
              alignment: AlignmentType.START,
              children: [
                new TextRun({
                  text: jobTitle,
                  bold: true,
                }),
                new TextRun({
                  text: jobRequirements,
                  break: 2,
                }),
              ],
            }),
          ],
          width: {size: 35, type: WidthType.PERCENTAGE},
          ...cellStyles.centeredCell,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({text: numberOfEmployees})],
              alignment: AlignmentType.CENTER,
            }),
          ],
          width: {size: 5, type: WidthType.PERCENTAGE},
          ...cellStyles.centeredCell,
        }),
        new TableCell({
          children: [
            new Paragraph({
              spacing: {
                before: 0,
              },
              children: [new TextRun({text: jobDescription})],
            }),
          ],
          width: {size: 45, type: WidthType.PERCENTAGE},
          ...cellStyles.centeredCell,
        }),
      ],
    });
  };

  const generateDepartmentRow = (title: string) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({children: [new TextRun({text: title, bold: true})], alignment: AlignmentType.CENTER}),
          ],
          width: {size: 100, type: WidthType.PERCENTAGE},
          ...cellStyles.coloredCenteredCell,
          columnSpan: 4,
        }),
      ],
    });
  };

  const generateOrganizationUnitList = () =>
    tableData.map(
      (item, index) =>
        new TextRun({
          text: `${index + 1}. ${item.title}`,
          break: 1,
          bold: true,
        }),
    );
  const generateRowSerialNumber = (currentIndex: number, numberOfEmployees: number) => {
    if (numberOfEmployees === 1) {
      return `${currentIndex}.`;
    } else {
      return `${currentIndex}-${currentIndex + numberOfEmployees - 1}.`;
    }
  };

  const generateJobRows = () => {
    const tableRows: TableRow[] = [];
    let serialNumber = 1;

    tableData.forEach(item => {
      tableRows.push(generateDepartmentRow(item.title));
      if (item?.job_positions_organization_units?.length > 0) {
        item.job_positions_organization_units.forEach(jobPosition => {
          tableRows.push(
            generateJobRow({
              serialNumber: generateRowSerialNumber(serialNumber, jobPosition.available_slots),
              jobTitle: jobPosition.job_title,
              jobRequirements: jobPosition.requirements,
              jobDescription: jobPosition.description,
              numberOfEmployees: jobPosition.available_slots.toString(),
            }),
          );
          serialNumber += jobPosition.available_slots;
        });
      }
    });
    return tableRows;
  };

  const calculateTotalNumberOfEmployees = () => {
    let count = 0;
    tableData.forEach(item => {
      if (item?.job_positions_organization_units?.length > 0) {
        item.job_positions_organization_units.forEach(jobPosition => {
          count += jobPosition.available_slots;
        });
      }
    });
    return count;
  };

  const table = new Table({
    columnWidths: [15, 35, 5, 45],
    rows: [tableHeader, ...generateJobRows()],
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              before: 250,
              after: 250,
            },
          },
          run: {
            font: 'Arial',
            size: 28,
          },
        },
      },
    },

    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: Uint8Array.from(atob(coatOfArmsBase64), c => c.charCodeAt(0)),
                transformation: {
                  width: 109,
                  height: 119,
                },
              }),
            ],
            spacing: {
              before: 0,
              after: 0,
            },
          }),
          new Paragraph({
            spacing: {
              before: 0,
            },
            alignment: AlignmentType.START,
            children: [
              new TextRun({
                text: 'CRNA GORA',
                bold: true,
                break: 1,
              }),
              new TextRun({
                text: `${organizationUnit}`,
                bold: true,
                break: 1,
                allCaps: true,
              }),
              new TextRun({
                text: 'Posl.br.I-8-Su. ____ ',
                bold: true,
                break: 1,
              }),
              new TextRun({
                text: `Dana, ${date}. godine`,
                bold: true,
                break: 1,
              }),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 500,
              after: 500,
            },
            children: [
              new TextRun({
                size: 28,
                text: 'Na osnovu člana 55 stav 2 Zakona o sudovima ("Sl.list CG", broj 11/15 i 76/20), u vezi člana 159 a Zakona o državnim službenicima i namještenicima („Sl.list CG“ br.2/18, 34/19 i 8/2021), uz saglasnost Vlade, predsjednik/ca suda __________________',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'PREDLOG PRAVILNIKA',
                bold: true,
              }),
              new TextRun({
                text: 'O UNUTRAŠNJOJ ORGANIZACIJI I SISTEMATIZACIJI ',
                bold: true,
                break: 1,
              }),
              new TextRun({
                text: `${organizationUnit}`,
                bold: true,
                allCaps: true,
                break: 1,
              }),
              new TextRun({
                text: 'Član 1.',
                bold: true,
                break: 2,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `Ovim pravilnikom utvrđuje se unutrašnja organizacija i sistematizacija – ${organizationUnit}.`,
                break: 2,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'I. ORGANIZACIONE JEDINICE I NJIHOV DJELOKRUG',
                bold: true,
                underline: {
                  type: UnderlineType.SINGLE,
                },
                break: 2,
              }),
              new TextRun({
                text: 'Član 2.',
                bold: true,
                break: 2,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `Organizacione jedinice u ${organizationUnit} su:`,
                break: 1,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.START,
            children: [...generateOrganizationUnitList()],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Član 3.',
                bold: true,
                break: 2,
              }),
              new TextRun({
                text: 'II. SISTEMATIZACIJA POSLOVA I ZADATAKA',
                bold: true,
                underline: {
                  type: UnderlineType.SINGLE,
                },
                break: 2,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Član 7.',
                bold: true,
                break: 2,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `U ${organizationUnit} sistematizuju se službenička i namještenička  mjesta sa ${calculateTotalNumberOfEmployees()} izvršioca (SLOVIMA izvršioca).`,
                break: 1,
              }),
            ],
          }),
          //generated table
          table,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'III. PRELAZNE I ZAVRŠNE ODREDBE',
                bold: true,
                underline: {
                  type: UnderlineType.SINGLE,
                },
                break: 2,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};

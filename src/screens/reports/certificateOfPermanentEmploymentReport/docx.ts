import {AlignmentType, Document, Packer, Paragraph, TextRun, UnderlineType, Footer} from 'docx';
import {CertificateOfPermanentEmploymentReport} from './types.ts';

export const generateDocxDocument = (props: CertificateOfPermanentEmploymentReport) => {
  const {serial_number, organization_unit, date, reason_for_certificate, employee_name, job_position, department} =
    props;
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
            font: 'Times New Roman',
            italics: true,
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
            alignment: AlignmentType.START,
            children: [
              new TextRun({
                text: 'Broj: ',
                bold: true,
              }),
              new TextRun({
                underline: {
                  type: UnderlineType.SINGLE,
                },
                bold: true,
                text: `${serial_number}`,
              }),
            ],
          }),
          new Paragraph({
            spacing: {
              after: 500,
            },
            alignment: AlignmentType.START,
            children: [
              new TextRun({
                text: 'Podgorica, ',
                bold: true,
              }),
              new TextRun({
                underline: {
                  type: UnderlineType.SINGLE,
                },
                text: `${date}.`,
                bold: true,
              }),
              new TextRun({
                text: ' godine',
                bold: true,
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
                text: `       Na zahtjev ${employee_name}, na osnovu čl. 33 Zakona o upravnom postupku ("Sl.list CG" br. 56/14, 20/15, 40/16 I 37/17),  i z d a j e  s e`,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 500,
              after: 500,
            },
            children: [
              new TextRun({
                text: 'P O T V R D A',
                bold: true,
              }),
              new TextRun({
                text: `       Kojom se potvrdjuje da je ${employee_name}, u stalnom radnom odnosu u ${organization_unit}, na radnom mjestu ${job_position}, u ${department}.`,
                break: 3,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `       Imenovanom potvrda služi radi ${reason_for_certificate}, te se u druge svrhe se ne može upotrijebiti. `,
              }),
            ],
          }),
        ],
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.END,
                spacing: {
                  before: 300,
                  after: 300,
                },
                children: [
                  new TextRun({
                    text: 'SEKRETAR/KA SEKRETARIJATA',
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: '____________________________',
                    break: 2,
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
        },
      },
    ],
  });

  return Packer.toBlob(doc);
};

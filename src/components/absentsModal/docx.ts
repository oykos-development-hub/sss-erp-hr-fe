import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  UnderlineType,
  Footer,
} from 'docx';
import {AnnualLeaveDecisionDocumentProps} from './types.ts';

export const generateDocxDocument = (props: AnnualLeaveDecisionDocumentProps) => {
  const {
    serialNumber,
    date,
    year,
    numberOfDays,
    fullName,
    jobTitle,
    department,
    currentUser,
    dateOfStart,
    dateOfEnd,
    nextBusinessDay,
  } = props;
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
            size: 22,
            italics: true,
          },
        },
      },
    },

    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            spacing: {
              after: 200,
            },
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            children: [
              new TextRun({
                size: 24,
                text: 'Broj: ',
              }),
              new TextRun({
                size: 24,
                underline: {
                  type: UnderlineType.SINGLE,
                },
                text: `${serialNumber}`,
              }),
              new TextRun({
                size: 24,
                text: '\tPodgorica, ',
              }),
              new TextRun({
                size: 24,
                underline: {
                  type: UnderlineType.SINGLE,
                },
                text: `${date}.`,
              }),
              new TextRun({
                size: 24,
                text: ' godine',
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
                size: 22,
                text: '       Na osnovu člana 69 Zakona o državnim službenicima i namještenicima („Sl.list CG“, br.2/18,34/19 i 8/21), i člana 3 Kolektivnog ugovora Sekretarijata Sudskog savjeta, sekretarka Sekretarijata Sudskog savjeta donosi',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'R J E Š E NJ E',
                bold: true,
              }),
              new TextRun({
                text: `o korišćenju godišnjeg odmora za ${year}. godinu`,
                bold: true,
                break: 1,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `       ${fullName}`,
                bold: true,
              }),
              new TextRun({
                text: `, ${jobTitle} u ${department} Sekretarijata Sudskog savjeta, određuje se godišnji odmor za ${year}. godinu u trajanju od ukupno ${numberOfDays} radnih dana.`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `       Imenovani će koristiti godišnji odmor u periodu od ${dateOfStart} godine do ${dateOfEnd} godine i dužan je da se javi na posao ${nextBusinessDay} godine.`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '       Godišnji odmor se može prekinuti posebnim rješenjem sekretarke Sekretarijata Sudskog savjeta.',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 300,
              after: 300,
            },
            children: [
              new TextRun({
                text: 'O b r a z l o ž e n j e',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '       Članom 69 Zakona o državnim službenicima i namještenicima propisano je da državni službenik, odnosno namještenik, ima pravo na godišnji odmor, koji se određuje prema dužini trajanja radnog staža i to: od ___ do ___ godina – ___ radnih dana.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '       Članom 3 tačka 1 Kolektivnog ugovora Sekretarijata Sudskog savjeta, propisano je da se državnom službeniku-namješteniku pored minimuma godišnji odmor uvećava prema dužini radnog staža, i to od ___ do ___ godina - ___ radni dan.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '       Članom 3 stav 3 tačka 3 Kolektivnog ugovora Sekretarijata Sudskog savjeta propisano je da se državnom službeniku-namješteniku pored minimuma godišnji odmor uvećava roditelju sa dvoje ili više djece do 16 godina života- ___ radna dana.  ',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '       Uvidom u kadrovsku evidenciju utvrđeno je da imenovani ima neprekidan radni staž u trajanju od ___ godina i ___ mjeseci, pa je stoga odlučeno kao u dispozitivu rješenja.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '       PRAVNA POUKA: ',
                bold: true,
              }),
              new TextRun({
                text: 'Protiv ovog rješenja može se podnijeti žalba Komisiji za žalbe Vlade Crne Gore u roku od 8 dana od dana prijema istog, preko ovog Sekretarijata.',
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
                  }),
                  new TextRun({
                    text: '____________________________',
                    break: 2,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.START,
                children: [
                  new TextRun({
                    text: 'Dostavljeno:',
                    bold: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: '-imenovanom,',
                    bold: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: '-u  dosije, ',
                    bold: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: '- a/a ',
                    bold: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: `Obradio/la: ${currentUser}`,
                    bold: true,
                    break: 1,
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

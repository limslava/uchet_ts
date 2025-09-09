import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

export class VehicleActExportService {
  
  async generateDocx(act) {
    try {
      const { 
        contractNumber, 
        date, 
        principal, 
        sender, 
        direction,
        licensePlate, 
        makeModel, 
        vin, 
        color, 
        year,
        equipment,
        fuelLevel,
        internalContents,
        inspectionTime,
        externalCondition,
        interiorCondition,
        paintInspectionImpossible,
        photos,
        transportMethod
      } = act;

      const formattedDate = new Date(date).toLocaleDateString('ru-RU');
      const shortContractNumber = contractNumber ? contractNumber.slice(-2) : '';

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 400,
                bottom: 400,
                left: 400,
                right: 400
              }
            }
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'ООО «Симпл Вэй» ОГРН: 122250000047. ИНН: 2543164502. КПП: 254301001',
                  size: 18,
                })
              ],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '690108 г. Владивосток, Вилкова, 5А',
                  size: 18,
                })
              ],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({ text: '' }),

            // ... остальное содержимое из оригинального файла
            // (полный код из вашего оригинального VehicleActExportService.js)
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      return buffer;
    } catch (error) {
      console.error('Error generating DOCX:', error);
      throw new Error('Не удалось сгенерировать документ');
    }
  }

  // ... остальные методы из оригинального файла
}

export const vehicleActExportService = new VehicleActExportService();
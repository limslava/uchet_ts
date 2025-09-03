// backend/src/services/VehicleActExportService.js
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

            new Paragraph({
              children: [
                new TextRun({
                  text: `АКТ ПРИЕМА-ПЕРЕДАЧИ № ${shortContractNumber}`,
                  size: 22,
                  bold: true,
                })
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `К Договору № ${contractNumber || ''}`,
                  size: 18,
                  bold: true,
                })
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: '' }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              margins: { top: 100, bottom: 100 },
              rows: [
                new TableRow({
                  children: [
                    this.createTableCell('Принципал/Получатель', true, 18),
                    this.createTableCell('Гос. номер', true, 18),
                    this.createTableCell('Дата', true, 18)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell(principal || '', false, 16),
                    this.createTableCell(licensePlate || '', false, 16),
                    this.createTableCell(formattedDate, false, 16)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell('Отправитель', true, 18),
                    this.createTableCell('Пункт назначения', true, 18),
                    this.createTableCell('Способ перевозки', true, 18)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell(sender || '', false, 16),
                    this.createTableCell(direction || '', false, 16),
                    this.createTableCell(transportMethod || '', false, 16)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell('Марка и модель', true, 18),
                    this.createTableCell('VIN', true, 18),
                    this.createTableCell('Цвет', true, 18)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell(makeModel || '', false, 16),
                    this.createTableCell(vin || '', false, 16),
                    this.createTableCell(color || '', false, 16)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell('Год выпуска', true, 18),
                    this.createTableCell('', true, 18),
                    this.createTableCell('', true, 18)
                  ]
                }),
                new TableRow({
                  children: [
                    this.createTableCell(year ? year.toString() : '', false, 16),
                    this.createTableCell('', false, 16),
                    this.createTableCell('', false, 16)
                  ]
                })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Комплектность:',
                  size: 20,
                  bold: true,
                })
              ]
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnWidths: [33.33, 33.33, 33.33],
              margins: { top: 50, bottom: 50 },
              rows: [
                this.createEquipmentRow(['Щетки стеклоочистителя', 'Противотуманные фары', 'АКБ'], equipment),
                this.createEquipmentRow(['Зеркала наружные', 'Зеркало внутреннее', 'Брызговики'], equipment),
                this.createEquipmentRow(['Колпаки колес', 'Литые диски', 'Ключ зажигания'], equipment),
                this.createEquipmentRow(['Брелок сигнализации', 'Личинка ключа', 'Ключ-карта'], equipment),
                this.createEquipmentRow(['Коврики', 'Подголовники', 'Радиоприемник'], equipment),
                this.createEquipmentRow(['Карта памяти', 'Монитор', 'Рем.комплект'], equipment),
                this.createEquipmentRow(['Колесо запасное', 'Домкрат', 'Ключ-балонник'], equipment),
                this.createEquipmentRow(['Шторка/полка багаж.', 'Видеорегистратор', ''], equipment)
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Уровень топлива (в %): ${fuelLevel || '0%'}`,
                  size: 20,
                  bold: true,
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Перечень внутренних вложений в а/м:',
                  size: 20,
                  bold: true,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: internalContents || 'Отсутствуют',
                  size: 18,
                })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '*При приемке автомобиля проверка технического состояния узлов, агрегатов, электрических и электронных систем не производится. Ответственность за их работоспособность и состояние Экспедитор не несет. За повреждения салона автомобиля, произошедшее вследствие нахождения в нем предметов не относящихся к заводской комплектации, Экспедитор ответственности не несет.',
                  size: 12,
                  italics: true,
                })
              ]
            }),
            new Paragraph({ text: '' }),

            this.createInfoRowCompact('Условия осмотра', inspectionTime || 'день'),
            this.createInfoRowCompact('Внешнее состояние а/м', externalCondition || 'Чистый'),
            this.createInfoRowCompact('Осмотр ЛКП невозможен', paintInspectionImpossible ? 'Да' : 'Нет'),
            this.createInfoRowCompact('Карта внешнего вида', `${photos?.length || 0} шт.`),
            this.createInfoRowCompact('Состояние салона автомобиля', externalCondition || 'Чистый'),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '*Автомобиль принят без тщательного осмотра, без мойки. При получении автомобиля клиент обязуется не предъявлять претензии по внешним повреждениям, которые не могли быть обнаружены при передаче.\n\n*При обнаружении повреждений, не отмеченных в данном акте, приоритетными следует считать фотографии, сделанные при описи автомобиля.',
                  size: 12,
                  italics: true,
                })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'Ознакомлен ___________________', 
                  size: 20,
                  bold: true
                }),
                new TextRun({ text: '\t\tподпись, ФИО', size: 16 })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'Прочее:', 
                  size: 20,
                  bold: true
                })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'Передал:____________________________', 
                  size: 20,
                  bold: true
                }),
                new TextRun({ text: '\t\tподпись, ФИО', size: 16 })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'Принял:______________________________', 
                  size: 20,
                  bold: true
                }),
                new TextRun({ text: '\t\tподпись, ФИО', size: 16 })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Отметка Грузополучателя:',
                  size: 20,
                  bold: true,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Автомобиль получил, претензий к перевозке не имею.',
                  size: 16,
                  italics: true,
                })
              ]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '______________________________',
                  size: 16,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'подпись, ФИО',
                  size: 16,
                  italics: true,
                })
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '«_______»_______________ 20____ г.',
                  size: 16,
                })
              ],
              alignment: AlignmentType.RIGHT,
            })
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

  createInfoRowCompact(label, value) {
    return new Paragraph({
      children: [
        new TextRun({ 
          text: `${label}${label.includes('Карта внешнего вида') ? ' (кол-во фотографий)' : ''}: `, 
          bold: true, 
          size: 18
        }),
        new TextRun({ 
          text: value || 'не указано', 
          bold: false,
          size: 16
        })
      ]
    });
  }

  createTableCell(text, bold = false, size = 16) {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: size,
              bold: bold,
            })
          ]
        })
      ],
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
  }

  createEquipmentRow(labels, equipment) {
    const cells = labels.map(label => {
      if (!label) return this.createTableCell('', false, 8);
      
      const value = equipment?.[this.getEquipmentKey(label)] || 'нет';
      return new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${label}: `,
                size: 18,
                bold: true,
              }),
              new TextRun({
                text: value,
                size: 16,
                bold: false,
              })
            ]
          })
        ],
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
    });
    
    return new TableRow({ children: cells });
  }

  getEquipmentKey(label) {
    const mapping = {
      'Щетки стеклоочистителя': 'wipers',
      'Противотуманные фары': 'fogLights',
      'АКБ': 'battery',
      'Зеркала наружные': 'mirrorsOuter',
      'Зеркало внутреннее': 'mirrorInner',
      'Брызговики': 'mudguards',
      'Колпаки колес': 'wheelCaps',
      'Литые диски': 'alloyWheels',
      'Ключ зажигания': 'ignitionKey',
      'Брелок сигнализации': 'alarmFob',
      'Личинка ключа': 'keyCylinder',
      'Ключ-карта': 'keyCard',
      'Коврики': 'floorMats',
      'Подголовники': 'headrests',
      'Радиоприемник': 'radio',
      'Карта памяти': 'sdCard',
      'Монитор': 'monitor',
      'Рем.комплект': 'repairKit',
      'Колесо запасное': 'spareWheel',
      'Домкрат': 'jack',
      'Ключ-балонник': 'wheelWrench',
      'Шторка/полка багаж.': 'trunkShelf',
      'Видеорегистратор': 'dashCam'
    };
    
    return mapping[label] || label.toLowerCase().replace(/\s+/g, '');
  }
}

export const vehicleActExportService = new VehicleActExportService();
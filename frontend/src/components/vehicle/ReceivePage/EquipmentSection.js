import React from 'react';

const EQUIPMENT_ITEMS = [
  { key: 'wipers', label: 'Щетки стеклоочистителя', options: ['нет', '1', '2', '3'] },
  { key: 'fogLights', label: 'Противотуманные фары', options: ['нет', '1', '2'] },
  { key: 'battery', label: 'АКБ', options: ['нет', '1', '2'] },
  { key: 'mirrorsOuter', label: 'Зеркала наружные', options: ['нет', '1', '2', '3', '4'] },
  { key: 'mirrorInner', label: 'Зеркало внутреннее', options: ['нет', '1', '2'] },
  { key: 'mudguards', label: 'Брызговики', options: ['нет', '1', '2', '3', '4'] },
  { key: 'wheelCaps', label: 'Колпаки колес', options: ['нет', '1', '2', '3', '4'] },
  { key: 'alloyWheels', label: 'Литые диски', options: ['нет', '1', '2', '3', '4'] },
  { key: 'ignitionKey', label: 'Ключ зажигания', options: ['нет', '1', '2', '3'] },
  { key: 'alarmFob', label: 'Брелок сигнализации', options: ['нет', '1', '2', '3', '4'] },
  { key: 'keyCylinder', label: 'Личинка ключа', options: ['нет', '1', '2'] },
  { key: 'keyCard', label: 'Ключ-карта', options: ['нет', '1', '2'] },
  { key: 'floorMats', label: 'Коврики', options: ['нет', '1', '2', '3', '4'] },
  { key: 'headrests', label: 'Подголовники', options: ['нет', '1', '2', '3', '4'] },
  { key: 'radio', label: 'Радиоприемник', options: ['нет', '1'] },
  { key: 'sdCard', label: 'Карта памяти', options: ['нет', '1'] },
  { key: 'monitor', label: 'Монитор', options: ['нет', '1'] },
  { key: 'repairKit', label: 'Рем.комплект', options: ['нет', '1'] },
  { key: 'spareWheel', label: 'Колесо запасное', options: ['нет', '1'] },
  { key: 'jack', label: 'Домкрат', options: ['нет', '1'] },
  { key: 'wheelWrench', label: 'Ключ-балонник', options: ['нет', '1'] },
  { key: 'trunkShelf', label: 'Шторка/полка багаж.', options: ['нет', '1'] },
  { key: 'dashCam', label: 'Видеорегистратор', options: ['нет', '1'] },
];

export const EquipmentSection = ({ register, disabled }) => {
  return (
    <div className="equipment-section">
      <h3>Комплектность</h3>
      {EQUIPMENT_ITEMS.map(({ key, label, options }) => (
        <div key={key} className="equipment-item">
          <span>{label}</span>
          <select 
            {...register(`equipment.${key}`)} 
            className="form-select" 
            defaultValue="нет" 
            disabled={disabled}
          >
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
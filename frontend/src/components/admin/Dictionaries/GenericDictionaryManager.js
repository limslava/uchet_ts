import React from 'react';
import { DataTable } from '../../common/DataTable/DataTable';
import { Pagination } from '../../common/Pagination/Pagination';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import './GenericDictionaryManager.css';

export const GenericDictionaryManager = ({
  title,
  columns,
  data,
  loading,
  pagination = {}, // Добавляем значение по умолчанию
  filters = {}, // Добавляем значение по умолчанию
  onFilterChange,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  emptyMessage = "Данные не найдены",
  showSearch = true,
  additionalFilters = null
}) => {
  return (
    <div className="dictionary-manager">
      <div className="dictionary-header">
        <h2>{title}</h2>
        {onAdd && (
          <Button onClick={onAdd}>
            + Добавить
          </Button>
        )}
      </div>

      {(showSearch || additionalFilters) && (
        <div className="dictionary-filters">
          {showSearch && (
            <Input
              placeholder="Поиск..."
              value={filters.search || ''}
              onChange={(value) => onFilterChange?.('search', value)}
              style={{ width: '250px' }}
            />
          )}
          {additionalFilters}
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage={emptyMessage}
      />

      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page || 1}
          totalPages={pagination.pages || 1}
          totalItems={pagination.total || 0}
          itemsPerPage={pagination.limit || 20}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
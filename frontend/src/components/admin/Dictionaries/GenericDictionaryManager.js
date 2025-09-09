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
  pagination,
  filters,
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
        <Button onClick={onAdd}>
          + Добавить
        </Button>
      </div>

      <div className="dictionary-filters">
        {showSearch && (
          <Input
            placeholder="Поиск..."
            value={filters.search}
            onChange={(value) => onFilterChange('search', value)}
            style={{ width: '250px' }}
          />
        )}
        {additionalFilters}
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage={emptyMessage}
      />

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
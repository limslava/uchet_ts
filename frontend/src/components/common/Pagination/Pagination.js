import React from 'react';
import './Pagination.css';

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const pages = [];
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    }
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Показано {startItem}-{endItem} из {totalItems}
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Назад
        </button>

        {pages.map((page, index) => (
          <React.Fragment key={page}>
            {index > 0 && pages[index - 1] !== page - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default Pagination;
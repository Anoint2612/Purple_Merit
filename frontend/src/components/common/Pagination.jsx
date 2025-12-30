import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            <button
                className="btn-page"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft size={20} />
            </button>

            <span style={{ color: 'var(--text-muted)' }}>
                Page <strong style={{ color: 'var(--text)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text)' }}>{totalPages}</strong>
            </span>

            <button
                className="btn-page"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;

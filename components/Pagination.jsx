function Pagination({ currentPage, totalPages, onPageChange }) {
    const goToPrev = () => onPageChange(currentPage - 1);
    const goToNext = () => onPageChange(currentPage + 1);

    return (
        <div className="pagination">
            <button
                className="btn btn-secondary"
                onClick={goToPrev}
                disabled={currentPage === 1}
            >
                Trước
            </button>
            <span className="pagination-info">
                Trang {currentPage} / {totalPages}
            </span>
            <button
                className="btn btn-secondary"
                onClick={goToNext}
                disabled={currentPage === totalPages}
            >
                Sau
            </button>
        </div>
    );
}


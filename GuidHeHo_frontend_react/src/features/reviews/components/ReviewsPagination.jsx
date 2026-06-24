export default function ReviewsPagination({
    page,
    totalPages,
    previous,
    next,
    onPageChange,
}) {
    if (totalPages <= 1) return null

    return (
        <nav className="join mt-4" aria-label="Pagination des avis">
            <button
                type="button"
                className="join-item btn"
                disabled={!previous}
                onClick={() => onPageChange(page - 1)}
            >
                <span aria-hidden="true">«</span>
                <span className="sr-only">Page précédente</span>
            </button>

            <button type="button" className="join-item btn" disabled>
                Page {page} sur {totalPages}
            </button>

            <button
                type="button"
                className="join-item btn"
                disabled={!next}
                onClick={() => onPageChange(page + 1)}
            >
                <span aria-hidden="true">»</span>
                <span className="sr-only">Page suivante</span>
            </button>
        </nav>
    )
}

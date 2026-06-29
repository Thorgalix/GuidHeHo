export default function ReviewsPagination({
    page,
    totalPages,
    previous,
    next,
    onPageChange,
}) {
    if (totalPages <= 1) return null

    return (
        <nav className="join mt-4 flex justify-center" aria-label="Pagination des avis">
            <button
                type="button"
                className="join-item btn border-teal-600 bg-white text-teal-700 hover:bg-teal-100 disabled:bg-slate-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                disabled={!previous}
                onClick={() => onPageChange(page - 1)}
            >
                <span aria-hidden="true">«</span>
                <span className="sr-only">Page précédente</span>
            </button>

            <button
                type="button"
                className="join-item btn border-teal-600 bg-teal-50 text-slate-700 disabled:bg-teal-50 disabled:text-slate-700 dark:bg-teal-900 dark:text-teal-100 dark:disabled:bg-teal-900 dark:disabled:text-teal-100"
                disabled
            >
                Page {page} sur {totalPages}
            </button>

            <button
                type="button"
                className="join-item btn border-teal-600 bg-white text-teal-700 hover:bg-teal-100 disabled:bg-slate-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                disabled={!next}
                onClick={() => onPageChange(page + 1)}
            >
                <span aria-hidden="true">»</span>
                <span className="sr-only">Page suivante</span>
            </button>
        </nav>
    )
}

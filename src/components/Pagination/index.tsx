import { useProductStore } from "../../store/Product";

export const Pagination = () => {
    const {
        state: { currentPage, totalPages, filters },
        actions: { setPage, setItemsPerPage }
    } = useProductStore();
    return (
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2">
                <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Anterior"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50">Anterior</button>
                <span className="text-gray-700" aria-label={`Página ${currentPage} de ${totalPages}`} >Página {currentPage} de {totalPages}</span>
                <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Próxima"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50">Próxima</button>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage" className="text-gray-700">Itens/página:</label>
                <select id="itemsPerPage" value={filters.limit} onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md">
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
};

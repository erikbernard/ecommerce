import { useProductStore } from "../../store/Product";

export const SortFilter = () => {
    const sortBy = useProductStore(state => state.state.filters.sortBy);
    const setFilter = useProductStore(state => state.actions.setFilter);
    return (
        <select value={sortBy} onChange={e => setFilter({ sortBy: e.target.value as 'ASC' | 'DESC' })}
            className="p-2 border rounded-md bg-white">
            <option value="ASC">Mais Recentes</option>
            <option value="DESC">Mais Antigos</option>
        </select>
    );
};

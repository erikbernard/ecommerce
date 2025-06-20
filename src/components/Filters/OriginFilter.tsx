import { useProductStore } from "../../store/Product";

export const OriginFilter = () => {
    const origin = useProductStore(state => state.state.filters.origin);
    const setFilter = useProductStore(state => state.actions.setFilter);
    return (
        <select value={origin} onChange={e => setFilter({ origin: e.target.value as 'all' | 0 | 1 })}
            className="p-2 border rounded-md bg-white">
            <option value="all">Todas as Origens</option>
            <option value="0">Brasil</option>
            <option value="1">Europeu</option>
        </select>
    );
};
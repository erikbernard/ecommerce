import { useEffect } from "react";
import { useProductStore } from "../../store/Product";

export const SearchFilter = () => {
    const searchTerm = useProductStore(state => state.state.filters.searchTerm);
    const setFilter = useProductStore(state => state.actions.setFilter);

    // Debounce handler
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== useProductStore.getState().state.filters.searchTerm) {
                setFilter({ searchTerm });
            }
        }, 500); // 500ms debounce
        return () => clearTimeout(handler);
    }, [searchTerm, setFilter]);

    return (
        <input
            type="text"
            placeholder="Buscar por nome..."
            className="p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => useProductStore.setState(state => ({ state: { ...state.state, filters: { ...state.state.filters, searchTerm: e.target.value } } }))}
        />
    );
};

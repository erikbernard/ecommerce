import { useProductStore } from "../../store/Product";

export const PriceFilter = () => {
    const { minPrice, maxPrice } = useProductStore(state => state.state.filters);
    const setFilter = useProductStore(state => state.actions.setFilter);

    return (
        <div className="flex gap-2 items-center">
            <input type="number" placeholder="Min R$" value={minPrice} onChange={e => setFilter({ minPrice: parseInt(e.target.value) || 0 })}
                className="w-24 p-2 border rounded-md" />
            <span>-</span>
            <input type="number" placeholder="Max R$" value={maxPrice} onChange={e => setFilter({ maxPrice: parseInt(e.target.value) || 0 })}
                className="w-24 p-2 border rounded-md" />
        </div>
    );
};
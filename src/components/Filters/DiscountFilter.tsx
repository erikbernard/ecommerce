import type { ChangeEvent } from "react";
import { useProductStore } from "../../store/Product";

export const DiscountFilter = () => {
    const hasDiscount = useProductStore(state => state.state.filters.hasDiscount);
    const setFilter = useProductStore(state => state.actions.setFilter);


    const checkDiscountState = (checked: boolean): boolean => {
        return (checked && hasDiscount !== true) || (!checked && hasDiscount !== undefined);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (checkDiscountState(checked)) {
            setFilter({ hasDiscount: checked ? true : undefined });
        }
    };
    return (
        <div className="flex">
            <input
                checked={hasDiscount}
                onChange={handleChange}
                type="checkbox" name="hs-default-radio" className="shrink-0 mt-0.5 border-gray-200 rounded-full  disabled:opacity-50 disabled:pointer-events-none" id="hs-default-radio" />
            <label htmlFor="hs-default-radio" className="text-sm text-gray-500 ms-2">Descontos Ativos</label>
        </div>
    );
};
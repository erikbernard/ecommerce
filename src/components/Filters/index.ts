import { DiscountFilter } from "./DiscountFilter";
import { FilterRoot } from "./FilterRoot";
import { OriginFilter } from "./OriginFilter";
import { PriceFilter } from "./PriceFilter";
import { SearchFilter } from "./SearchFilter";
import { SortFilter } from "./SortFilter";

export const Filter = {
    Root: FilterRoot,
    Search: SearchFilter,
    Price: PriceFilter,
    Sort: SortFilter,
    Origin: OriginFilter,
    Discount: DiscountFilter
}
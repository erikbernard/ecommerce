import { create } from "zustand";
import type { ProductFilters, ProductStore } from "../../types";
import { useInteractionStore } from "../Interaction";
import { productsFromAPI } from "../../api/api.service";

export const useProductStore = create<ProductStore>((set, get) => ({
    state: {
        products: [],
        isLoading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        selectedProduct: null,
        filters: {
            offset: 0,
            limit: 10,
            searchTerm: '',
            minPrice: 0,
            maxPrice: 0,
            sortBy: 'ASC',
            origin: 'all',
        },
    },
    actions: {

        fetchProducts: async () => {
            try {
                set((prev) => ({
                    state: {
                        ...prev.state,
                        isLoading: true, error: null
                    },
                    actions: {
                        ...prev.actions
                    }
                }));
                const { state: { currentPage, filters } } = get();
                const data = await productsFromAPI(filters);
                set((prev) => ({
                    state: {
                        ...prev.state,
                        products: data.items,
                        totalPages: Math.ceil(data.total / filters.limit),
                        isLoading: false,
                        filters: {
                            ...prev.state.filters,
                            offset: (currentPage) * filters.limit,
                            limit: filters.limit,
                        }
                    },
                    actions: {
                        ...prev.actions
                    }
                }));
            } catch (error: any) {
                set((prev) => ({
                    state: {
                        ...prev.state,
                        error: error.message,
                        isLoading: false
                    },
                    actions: {
                        ...prev.actions
                    }
                }))
            }
        },
        setPage: (page: number) => {
            set((prev) => ({
                state: {
                    ...prev.state,
                    currentPage: page,
                    filters: {
                        ...prev.state.filters,
                        offset: (page - 1) * prev.state.filters.limit
                    },
                },
                actions: {
                    ...prev.actions
                }
            }));
            get().actions.fetchProducts()
        },
        setItemsPerPage: (limit: number) => {
            set((prev) => ({
                state: {
                    ...prev.state,
                    itemsPerPage: limit,
                    currentPage: 1,
                    filters: {
                        ...prev.state.filters,
                        limit: limit
                    }
                },
                actions: {
                    ...prev.actions
                }
            }));
            get().actions.fetchProducts()
        },
        selectProduct: (product) => {
            if (product) useInteractionStore.getState().actions.addRecentlyViewed(product.id);
            set((prev) => ({
                state: {
                    ...prev.state,
                    selectedProduct: product
                }, actions: {
                    ...prev.actions
                }
            }));
        },
        setFilter: (filterUpdate: Partial<ProductFilters>) => {
            if (filterUpdate.origin && filterUpdate.origin !== 'all') { filterUpdate.origin = parseInt(filterUpdate.origin.toString()) as 0 | 1; }
            set((prev) => ({
                state: {
                    ...prev.state,
                    isLoading: true,
                    error: null,
                    filters: {
                        ...prev.state.filters,
                        ...filterUpdate,
                        offset: 0,
                    },
                    currentPage: 1,
                },
                actions: {
                    ...prev.actions,
                }
            }));
            get().actions.fetchProducts();
        }
    },
}));
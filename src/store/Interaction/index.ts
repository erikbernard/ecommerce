import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InteractionStore } from "../../types";

export const useInteractionStore = create<InteractionStore>()(

    persist(
        (set, get) => ({
            state: {
                favoriteIds: [],
                recentlyViewedIds: [],
                isFavoritesOpen: false,
            },
            actions: {
                toggleFavorite: (productId) => {
                    const { state: { favoriteIds } } = get();
                    const newFavorites = favoriteIds.includes(productId)
                        ? favoriteIds.filter(id => id !== productId)
                        : [...favoriteIds, productId];
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            favoriteIds: newFavorites
                        }
                    }));
                },

                addRecentlyViewed: (productId) => {
                    const { state: { recentlyViewedIds } } = get();
                    const newRecentlyViewed = [productId, ...recentlyViewedIds.filter(id => id !== productId)].slice(0, 5);
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            recentlyViewedIds: newRecentlyViewed
                        }
                    }));
                },

                toggleFavorites: () => {
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            isFavoritesOpen: !prev.state.isFavoritesOpen
                        }
                    }));
                }
            }
        }),
        {
            name: 'ecommerce-interaction-storage',
            partialize: ((prev) => (
                {
                    state: {
                        favoriteIds: prev.state.favoriteIds,
                        recentlyViewedIds: prev.state.recentlyViewedIds,
                    }
                }
            ))
        }
    )
);
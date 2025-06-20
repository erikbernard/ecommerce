import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, PurchaseStore } from "../../types";
import { addReviewAPI, listOrderAPI, listReviewAPI } from "../../api/api.service";
import { useAuthStore } from "../Auth";
import { useModalStore } from "../Modal";

export const usePurchaseStore = create<PurchaseStore>()(
    persist(
        (set, get) => ({
            state: {
                purchasedItems: [],
                reviews: {},
                hasNewPurchases: false,
                isHistoryOpen: false,
            },
            actions: {
                addPurchase: (items) => {
                    const { state: { purchasedItems } } = get();
                    const existingItems = purchasedItems;
                    // Remove items duplicados e adiciona os novos
                    const filteredExistingItems = existingItems.filter(
                        pItem => !items.some(newItem => newItem.id === pItem.id)
                    );
                    const updatedItems = [...filteredExistingItems, ...items];
                    set(prev => ({
                        state: {
                            ...prev.state,
                            purchasedItems: updatedItems,
                            hasNewPurchases: true
                        }
                    }));
                },

                addReview: async (productId, rating) => {
                    const { state: { reviews } } = get();
                    const { id } = useAuthStore.getState().state.user;
                    try {
                        await addReviewAPI({
                            product_id: productId,
                            user_id: id,
                            rating: rating,
                            comment: "",
                        });
                        useModalStore.getState().actions.showModal('Avaliação adicionada com sucesso!', 'success');
                        set(prev => ({
                            state: {
                                ...prev.state,
                                reviews: {
                                    ...reviews,
                                    [productId]: rating
                                }
                            }
                        }));
                    } catch (error) {
                        useModalStore.getState().actions.showModal('Erro ao adicionar avaliação. Tente novamente.', 'error');
                    }
                },

                getListPurchase: async () => {
                    try {
                        const order = await listOrderAPI();
                        const review = await listReviewAPI();
                        console.log("order from API:", { order });
                        const { addPurchase } = get().actions;

                        const allItems = order.flatMap(order =>
                            order.items.map(item => ({
                                id: item.product.id,
                                provider: item.product.provider,
                                provider_id: item.product.id,
                                name: item.product.name,
                                price: +item.price,
                                stock: item.product.stock,
                                description: item.product.description,
                                image: item.product.image,
                                quantity: item.quantity,
                                hasDiscount: item.product.hasDiscount,
                                discountValue: item.product.discountValue,
                                created_at: item.product.created_at,
                                updated_at: item.product.updated_at,
                            }))
                        );

                        // Remover duplicados baseado no id
                        const purchasedItems: CartItem[] = allItems.filter((item, index, self) =>
                            index === self.findIndex(t => t.id === item.id)
                        );

                        const reviews: { [productId: number]: number } = {};
                        review.forEach(r => {
                            reviews[r.product_id] = r.rating;
                        });

                        addPurchase(purchasedItems);

                        set(prev => ({
                            state: {
                                ...prev.state,
                                reviews: reviews,
                                hasNewPurchases: true
                            },
                            actions: {...prev.actions},
                        }));

                    } catch (error) {
                        useModalStore.getState().actions.showModal('Erro ao carregar avaliações. Tente novamente.', 'error');
                    }
                },

                toggleHistory: () => {
                    const { state: { isHistoryOpen }, actions: { markPurchasesAsSeen } } = get();
                    set(prev => ({
                        state: {
                            ...prev.state,
                            isHistoryOpen: !isHistoryOpen
                        }
                    }));

                    if (isHistoryOpen) {
                        markPurchasesAsSeen();
                    }
                },

                markPurchasesAsSeen: () => {
                    const { state: { isHistoryOpen, purchasedItems }, actions: { getListPurchase } } = get();
                    if (isHistoryOpen && purchasedItems.length == 0) {
                        getListPurchase();
                    };

                    set(prev => ({
                        state: {
                            ...prev.state,
                            hasNewPurchases: false
                        }
                    }))
                }
            }
        }),
        {
            name: 'ecommerce-purchase-history-storage',
            partialize: ((prev) => (
                {
                    state: {
                        ...prev.state,
                        purchasedItems: prev.state.purchasedItems,
                        reviews: prev.state.reviews,
                    }
                }
            ))
        }
    )
);

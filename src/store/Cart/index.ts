import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore } from "../../types";


export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            state: {
                cartItems: [],
                isCartOpen: false,
                totalPrice: 0,
            },
            actions: {
                addToCart: (product) => {
                    const { state: { cartItems } } = get();
                    const existingItem = cartItems.find((item) => item.id === product.id);
                    if (existingItem) {
                        const updatedItems = cartItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                        set((prev) => ({
                            state: {
                                ...prev.state,
                                cartItems: updatedItems,
                                totalPrice: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)
                            }
                        }));
                    } else {
                        set((prev) => ({
                            state: {
                                ...prev.state,
                                cartItems: [...cartItems, { ...product, quantity: 1 }],
                                totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + product.price
                            }
                        }));
                    }
                },
                removeFromCart: (productId: string | number) => {
                    const { state: { cartItems } } = get();
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            cartItems: cartItems.filter((item: any) => item.id !== productId),
                            totalPrice: cartItems
                                .filter((item: any) => item.id !== productId)
                                .reduce((total, item: any) => total + item.price * item.quantity, 0)
                        }
                    }));
                },
                decreaseQuantity: (productId: string | number) => {
                    const { state: { cartItems } } = get();
                    const updatedItems = cartItems
                        .map((item: any) =>
                            item.id === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item: any) => item.quantity > 0);
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            cartItems: updatedItems,
                            totalPrice: updatedItems.reduce((total, item: any) => total + item.price * item.quantity, 0)
                        }
                    }));
                },
                clearCart: () => set((prev) => ({
                    state: {
                        ...prev.state,
                        cartItems: [],
                        totalPrice: 0
                    },
                    actions: prev.actions
                })),
                toggleCart: () => set((prev) => ({
                    state: {
                        ...prev.state,
                        isCartOpen: !prev.state.isCartOpen
                    }
                })),
            }
        }),
        {
            name: 'ecommerce-cart-storage',
            partialize: ((prev) => (
                {
                    state: {
                        ...prev.state
                    }
                }
            ))
        }
    )
);

import { create } from "zustand";
import type { CheckoutStore } from "../../types";
import type { CheckoutFormData } from "../../utils/validation";
import { usePurchaseStore } from "../Purchase";
import { useCartStore } from "../Cart";
import { useModalStore } from "../Modal";
import { useAuthStore } from "../Auth";
import { processOrderFromAPI } from "../../api/api.service";

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    state: {
        isCheckoutOpen: false,
        paymentMethod: 'card',
    },
    actions: {
        openCheckout: () => {
            set((prev) => ({
                state: {
                    ...prev.state,
                    isCheckoutOpen: true,
                }
            }))
        },
        closeCheckout: () => set((prev) => ({
            state: {
                ...prev.state,
                isCheckoutOpen: false,
            }
        })),
        setPaymentMethod: (method) => set((prev) => ({
            state: {
                ...prev.state,
                paymentMethod: method,
            }
        })),
        processOrder: async (order: CheckoutFormData) => {
            const { cartItems, totalPrice } = useCartStore.getState().state;
            const { paymentMethod } = useCheckoutStore.getState().state;
            const { id } = useAuthStore.getState().state.user;
            if (cartItems.length === 0) return;

            try {
                await processOrderFromAPI({
                    userId: id,
                    total: totalPrice,
                    address: order.address,
                    payment_method: paymentMethod,
                    status: "confirmed",
                    items: cartItems.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                });
                useModalStore.getState().actions.showModal(`Compra finalizada com sucesso! Pedido: ORDER-${Date.now()}`, 'success');
            } catch (error) {
                useModalStore.getState().actions.showModal("Erro ao processar o pedido. Tente novamente mais tarde.", 'error');
            }


            return new Promise((resolve) => {
                setTimeout(() => {
                    usePurchaseStore.getState().actions.addPurchase(cartItems);
                    useCartStore.getState().actions.clearCart();

                    set((prev) => ({
                        state: {
                            ...prev.state,
                            isCheckoutOpen: false,
                        },
                    }));
                    resolve();
                }, 1000);
            });
        }
    },
}));
import { create } from "zustand";
import type { AuthStore } from "../../types";
import { persist } from "zustand/middleware";
import { useCartStore } from "../Cart";
import { useModalStore } from "../Modal";
import { loginFromAPI, registerFromAPI } from "../../api/api.service";

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            state: {
                isAuthenticated: false,
                user: {
                    name: '',
                    email: '',
                    id: '',
                },
                accessToken: null,
                error: null,
                isLoading: false,
            },
            actions: {
                login: async (email: string, password: string) => {
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            isLoading: true,
                        },
                        actions: prev.actions
                    }));
                    try {
                        const response = await loginFromAPI(email, password);
                        const { accessToken, id, name } = response;
                        set((prev) => ({
                            state: {
                                ...prev.state,
                                isAuthenticated: true,
                                isLoading: true,
                                accessToken: accessToken,
                                user: { email, name: name, id: id }
                            },
                            actions: prev.actions
                        }));

                    } catch (error: any) {

                        setTimeout(() => {
                            set((prev) => ({
                                state: {
                                    ...prev.state,
                                    error: error.message,
                                    isLoading: false,
                                },
                                actions: prev.actions
                            }));
                        }, 1000); // Simulate loading delay
                    }
                },
                register: async (name: string, email: string, password: string, language: string) => {
                    try {
                        await registerFromAPI(name, email, password);
                        useModalStore.getState().actions.showModal(`Usuario registrado ${email}`, 'success');
                    } catch (error) {
                        useModalStore.getState().actions.showModal(`falhar ao registrar ${email}`, 'error');
                    }
                },
                logout: () => {
                    useCartStore.getState().actions.clearCart();
                    set((prev) => ({
                        state: {
                            ...prev.state,
                            isAuthenticated: false,
                            user: {
                                name: '',
                                email: '',
                                id: '',
                            },
                            accessToken: null
                        },
                        actions: prev.actions
                    }));
                }
            }
        }),
        {
            name: 'auth-storage',
            // FIX: Only persist the data, not the functions.
            partialize: ((prev) => (
                {
                    state: {
                        ...prev.state,
                        isLoading: false
                    },
                }
            ))
        },
    )
);

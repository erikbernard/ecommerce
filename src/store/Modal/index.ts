import { create } from "zustand";
import type { ModalStore } from "../../types";

export const useModalStore = create<ModalStore>((set) => ({
    state: {
        isOpen: false,
        message: '',
        status: 'info',
    },
    actions: {
        showModal: (message, status) => set((prev) => ({
            state: {
                ...prev.state,
                isOpen: true,
                message: message,
                status: status ?? 'info',
            },
            actions: {
                ...prev.actions
            }
        })),
        hideModal: () => set((prev) => ({
            state: {
                ...prev.state,
                isOpen: false,
                message: '',
                status: 'info',
            }
        })),
    }
}));
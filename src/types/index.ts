// --- /src/types/index.ts ---

import type { CheckoutFormData } from "../utils/validation";

export enum EProvider {
    BRAZILIAN,
    EUROPEAN,
}
export type Product = {
    id: number;
    provider: EProvider;
    provider_id: number; // ID do fornecedor
    name: string;
    hasDiscount: boolean;
    discountValue: number;
    price: number;
    stock: number;
    image: string;
    description: string;
    created_at: string; // ISO Date String
    updated_at: string; // ISO Date String
};

export type CartItem = Product & {
    quantity: number;
};

// Tipos para a store de produtos

export type ProductFilters = {
    offset: number;
    limit: number;
    searchTerm: string;
    minPrice: number;
    maxPrice: number;
    hasDiscount?: boolean
    sortBy: 'ASC' | 'DESC';
    origin: 'all' | 0 | 1;
};

export type ProductState = {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    selectedProduct: Product | null;
    filters: ProductFilters;
};
export type ProductActions = {
    fetchProducts: () => Promise<void>;
    setPage: (page: number) => void;
    setItemsPerPage: (limit: number) => void;
    selectProduct: (product: Product | null) => void;
    setFilter: (filter: Partial<ProductFilters>) => void;
};

// export type ProductStore = ProductState & ProductActions;
export type ProductStore = {
    state: ProductState;
    actions: ProductActions;
}

// Tipos para a store do carrinho
export type CartState = {
    cartItems: CartItem[];
    totalPrice: number;
    isCartOpen: boolean;
};

export type CartActions = {
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
};

// export type CartStore = CartState & CartActions;
export type CartStore = {
    state: CartState;
    actions: CartActions;
};

// Tipos para a store do modal genérico
export type ModalState = {
    isOpen: boolean;
    message: string;
    status: 'error' | 'success' | 'info';
};

export type ModalActions = {
    showModal: (message: string, status?: 'error' | 'success' | 'info') => void;
    hideModal: () => void;
};

// export type ModalStore = ModalState & ModalActions;
export type ModalStore = {
    state: ModalState;
    actions: ModalActions;
}
// Tipos para a store de histórico de compras
export type Review = { [productId: number]: number }

export type PurchaseState = {
    purchasedItems: CartItem[];
    reviews: Review;
    hasNewPurchases: boolean;
    isHistoryOpen: boolean;
}

export type PurchaseActions = {
    addPurchase: (items: CartItem[]) => void;
    addReview: (productId: number, rating: number, comment?: string) => void;
    toggleHistory: () => void;
    markPurchasesAsSeen: () => void;
    getListPurchase: () => void;
}

// export type PurchaseStore = PurchaseState & PurchaseActions;
export type PurchaseStore = {
    state: PurchaseState;
    actions: PurchaseActions;
};

// Tipos para a store de Interações do Usuário (Favoritos, Vistos Recentemente)
export type InteractionState = {
    favoriteIds: number[];
    recentlyViewedIds: number[];
    isFavoritesOpen: boolean;
}

export type InteractionActions = {
    toggleFavorite: (productId: number) => void;
    addRecentlyViewed: (productId: number) => void;
    toggleFavorites: () => void;
}

// export type InteractionStore = InteractionState & InteractionActions;
export type InteractionStore = {
    state: InteractionState;
    actions: InteractionActions;
};

// Tipos para a Store de Checkout
export type CheckoutState = {
    isCheckoutOpen: boolean;
    paymentMethod: 'card' | 'pix';
}

export type CheckoutActions = {
    openCheckout: () => void;
    closeCheckout: () => void;
    setPaymentMethod: (method: 'card' | 'pix') => void;
    processOrder: (order: CheckoutFormData) => Promise<void>;
}

export type CheckoutStore = {
    state: CheckoutState;
    actions: CheckoutActions;
};

export type AuthState = {
    isAuthenticated: boolean;
    user: {
        name: string;
        email: string,
        id: string
    }
    accessToken: string | null,
    isLoading: boolean;
    error: string | null;
}
export type AuthActions = {
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, language: string) => Promise<void>;
    logout: () => void;
}

// export type AuthStore = AuthState & AuthActions;
export type AuthStore = {
    state: AuthState;
    actions: AuthActions;
};
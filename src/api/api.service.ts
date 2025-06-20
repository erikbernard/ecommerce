import type {  Product, ProductFilters } from "../types";
import { api } from "./axios.config";

export function buildQueryString(filters: ProductFilters): string {
    const params = new URLSearchParams();
    if (filters.offset !== undefined) params.set('offset', filters.offset.toString());
    if (filters.limit !== undefined) params.set('limit', filters.limit.toString());
    if (filters.origin !== "all") params.set('provider', filters.origin.toString());
    if (filters.minPrice >= 0) {
        params.set('minPrice', filters.minPrice.toString())
    };
    if (filters.maxPrice !== 0) {
        params.set('maxPrice', filters.maxPrice.toString())
    };
    if (filters.hasDiscount !== undefined) {
        params.set('hasDiscount', filters.hasDiscount.toString())
    };
    if (filters.searchTerm) params.set('name', filters.searchTerm);
    if (filters.sortBy) params.set('order', filters.sortBy);

    return params.toString();
}

type FetchResponseAPI = {
    items: Product[];
    total: number,
    offset: number,
    limit: number,
}

export const productsFromAPI = async (filters: ProductFilters): Promise<FetchResponseAPI> => {
    const query = buildQueryString(filters);
    let response = await api.get("/products?" + query);
    return { ...response.data };
}
type FetchLogin = {
    email: string,
    name: string,
    id: string,
    accessToken: string,
}
export const loginFromAPI = async (email: string, password: string): Promise<FetchLogin> => {
    try {
        let response = await api.post("/user/signin", {
            email,
            password
        });
        return response.data;

    } catch (error: any) {
        // Tratar erros específicos da API aqui
        if (error.response?.status === 400) {
            throw new Error('Credenciais inválidas');
        } else if (error.response?.status === 500) {
            throw new Error('Erro interno do servidor');
        } else {
            throw new Error('Erro ao fazer login. Tente novamente.');
        }
    }
}
export type Order = {
    userId: string,
    total: number,
    address: string,
    payment_method: 'card' | 'pix';
    status: "pending" | "confirmed" | "cancelled",
    items: productItem[]
}
type productItem = {
    product_id: number,
    quantity: number,
    price: number,
}
export const processOrderFromAPI = async (order: Order): Promise<any> => {
    try { 
        let response = await api.post("/orders", order);
        return { ...response };
    } catch (error: any) {
        // Tratar erros específicos da API aqui
        if (error.response?.status === 400) {
            throw new Error('Dados inválidos para o pedido');
        } else {
            throw new Error('Erro interno do servidor');
        }
    }
}

type listOrder = {
    id: number,
    user_id: string,
    total: number,
    payment_method: 'card' | 'pix';
    status: "pending" | "confirmed" | "cancelled",
    items: {
        id: number,
        product: Product,
        quantity: number,
        price: number,
    }[]
}
export const listOrderAPI = async (): Promise<listOrder[]> => {

    try {
        const response = await api.get("/orders");
        return response.data;
    }
    catch (error: any) {
        // Tratar erros específicos da API aqui
        if (error.response?.status === 400) {
            throw new Error();
        } else {
            throw new Error('Erro interno do servidor ao listar pedidos');
        }
    }
}



type review = {
    product_id: number,
    user_id: string,
    rating: number,
    comment?: string
}

export const addReviewAPI = async (review: review): Promise<any> => {

    try {
        const response = await api.post("/reviews", review);
        console.log("Response from API:", { response });
        return response.data
    }
    catch (error: any) {
        // Tratar erros específicos da API aqui
        if (error.response?.status === 400) {
            throw new Error(error.response.data.message || 'Dados inválidos para avaliação');
        } else {
            throw new Error('Erro interno do servidor ao adicionar avaliação');
        }
    }
}


type ReviewAPIResponse = {
    id: number,
    rating: number,
    comment?: string,
    product: Product,
    user_id: string,
    product_id: number,
    created_at: string,
}

export const listReviewAPI = async (): Promise<ReviewAPIResponse[]> => {

    try {
        const response = await api.get("/reviews");
        return response.data as ReviewAPIResponse[]; 
    }
    catch (error: any) {
        // Tratar erros específicos da API aqui
        if (error.response?.status === 400) {
            throw new Error();
        } else {
            throw new Error('Erro interno do servidor ao listar avaliações');
        }
    }
}

// Mock dada para simular a resposta da API
// Simula 100 produtos com dados aleatórios
// const mockProducts: Product[] = Array.from({ length: 100 }, (_, i) => ({
//     id: i + 1, name: `Produto Incrível ${i + 1}`,
//     price: parseFloat((Math.random() * (200 - 50) + 50).toFixed(2)),
//     image: `https://placehold.co/400x400/a3e635/1f2937?text=Produto+${i + 1}`,
//     description: 'Esta é uma descrição fantástica e detalhada do produto.',
//     provider: Math.random() > 0.5 ? 1 : 0,
//     provider_id: Math.floor(Math.random() * 10) + 1,
//     stock: Math.floor(Math.random() * 100) + 1,
//     created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
//     updated_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
// }));

// export const fetchMockProductsFromAPI = async (page: number, limit: number, filters: ProductFilters): Promise<FetchResponse> => {
//     let response = await apiClient("/products") as FetchResponseAPI;
//     console.log("Response from API:", response);

//     let filteredProducts = [...mockProducts];

//     // Apply filters
//     if (filters.searchTerm) {
//         filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));
//     }
//     if (filters.minPrice) {
//         filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
//     }
//     if (filters.maxPrice) {
//         filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
//     }
//     if (filters.origin !== 'all') {
//         filteredProducts = filteredProducts.filter(p => p.provider === filters.origin);
//     }

//     // Apply sorting
//     if (filters.sortBy === 'DESC') {
//         filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     } else {
//         filteredProducts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
//     }

//     // Apply pagination
//     const start = (page - 1) * limit;
//     const end = start + limit;
//     const paginatedProducts = filteredProducts.slice(start, end);

//     return new Promise(resolve => { setTimeout(() => { resolve({ products: paginatedProducts, totalPages: Math.ceil(filteredProducts.length / limit) }); }, 300); });
// };
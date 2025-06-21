import { useAuthStore } from "../store/Auth";

export const apiClient = async (url: string, options: RequestInit = {}): Promise<any> => {
    const token = useAuthStore.getState().state.accessToken;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Em uma aplicação real, aqui seria a URL base da sua API
    // Ex: const response = await fetch(`https://api.meusite.com${url}`, {
    const baseUrl = process.env.BASE_URL;
    const response = await fetch(baseUrl + url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Simula erro de token inválido
        if (response.status === 401 || response.status === 403) {
            useAuthStore.getState().actions.logout();
        }
        throw new Error('Falha na requisição à API');
    }

    // Retorna a resposta em JSON se houver corpo, senão retorna a resposta crua
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response;
};
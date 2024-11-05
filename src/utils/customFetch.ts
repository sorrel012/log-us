const TIMEOUT = 30 * 1000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetchConfig {
    queryKey: any[];
    method?: HttpMethod;
    body?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    options?: any;
    staleTime?: number;
    invalidateCache?: boolean;
}

interface FetchState<T> {
    data?: T;
    isLoading: boolean;
    isError: boolean;
    error?: string;
}

export async function customFetch<T>(
    url: string,
    config: Partial<FetchConfig> & { queryKey: any[] },
): Promise<FetchState<T>> {
    const controller = new AbortController();
    const { signal } = controller;

    let { method, data, params, headers = {}, options = {} } = config;

    if (!method) {
        method = 'GET';
    }

    if (!(data instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    let baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (method === 'GET' && params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
    }

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    let state: FetchState<T> = {
        isLoading: true,
        isError: false,
    };

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method,
            body: data instanceof FormData ? data : JSON.stringify(data),
            headers,
            ...options,
            signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            state.isError = true;
            state.error = `서버 오류가 발생하였습니다. ${response.statusText}`;
        }

        state.data = (await response.json()) as T;
        state.isLoading = false;
    } catch (error) {
        clearTimeout(timeoutId);
        state.isLoading = false;
        state.isError = true;

        if (error.name === 'AbortError') {
            state.error =
                '응답 시간이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.';
        } else {
            state.error =
                (error as Error).message || '네트워크 오류가 발생했습니다.';
        }
    } finally {
        clearTimeout(timeoutId);
    }

    return state;
}

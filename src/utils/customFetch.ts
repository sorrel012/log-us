const TIMEOUT = 30 * 1000;

interface FetchState<T> {
    data?: T;
    isLoading: boolean;
    isError: boolean;
    error?: string;
}

export interface FetchConfig {
    method?: HttpMethod;
    data?: any;
    headers?: Record<string, string>;
    options?: any;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function customFetch<T>(
    url: string,
    config: FetchConfig = {},
): Promise<FetchState<T>> {
    const controller = new AbortController();
    const { signal } = controller;

    let { method, data, headers = {}, options = {} } = config;

    if (!method) {
        method = 'GET';
    }

    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    //TODO mber-id zustand에서 받아오는 걸로 수정 필요
    headers['member-id'] = 'sorrel012';

    let baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    let state: FetchState<T> = {
        isLoading: true,
        isError: false,
    };

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method,
            ...(data && { body: JSON.stringify(data) }),
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
            state.error = error.message || '네트워크 오류가 발생했습니다.';
        }
    } finally {
        clearTimeout(timeoutId);
    }

    return state;
}

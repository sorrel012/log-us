const TIMEOUT = 60 * 1000;

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
    code?: number;
}

export function getCacheData(key: string) {
    const cookieString = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`));
    return cookieString
        ? JSON.parse(decodeURIComponent(cookieString.split('=')[1]))
        : null;
}

export async function customFetch<T>(
    url: string,
    config: Partial<FetchConfig> & { queryKey: any[] },
): Promise<FetchState<T>> {
    const controller = new AbortController();
    const { signal } = controller;

    let { method, body, params, headers = {}, options = {} } = config;

    let state: FetchState<T> = {
        isLoading: true,
        isError: false,
    };

    const cacheKey = JSON.stringify(config.queryKey);
    const cachedData = getCacheData(cacheKey);
    const staleTime = config.staleTime || 120;

    if (method === 'GET' && cachedData && !config.invalidateCache) {
        return { data: cachedData, isLoading: false, isError: false };
    }

    //TODO 토큰 받아오는 것으로 수정
    if (true) {
        headers['Authorization'] =
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL2Jsb2cubG9ndXMuY29tLyIsImlzQWRtaW4iOiJmYWxzZSIsInN1YiI6InVzZXIxIiwiaWF0IjoxNzMwOTY5NjgxLCJleHAiOjE3MzYxNTM2ODF9.UlFUJesaNmAVte27M-_xV90TurL0j6vq8v-gWjI0R4Oj8wmlQHSpOv2kkmpKP2JpT7dCnnT4WucTWtPmeepyDg';
    }

    if (!method) {
        method = 'GET';
    }

    if (!(body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    let baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (method === 'GET' && params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
    }

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method,
            body: body instanceof FormData ? body : JSON.stringify(body),
            headers,
            ...options,
            signal,
            credentials: 'include',
        });

        clearTimeout(timeoutId);

        const resultData = (await response.json()) as T;

        if (!response.ok) {
            state.isError = true;
            state.error = resultData.message || '서버 오류가 발생하였습니다';
            state.code = resultData.code;
        }

        state.data = resultData.data;
        state.isLoading = false;

        if (
            method === 'GET' &&
            state.data &&
            !state.isError &&
            config.queryKey[0] !== 'post' &&
            !config.invalidateCache
        ) {
            document.cookie = `${cacheKey}=${encodeURIComponent(
                JSON.stringify(state.data),
            )}; max-age=${staleTime}`;
        }
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

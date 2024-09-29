const TIMEOUT = 30 * 1000;

export async function customFetch<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers?: Record<string, string>,
    options?: Omit<RequestInit, 'headers'>,
): Promise<T> {
    const controller = new AbortController();
    const { signal } = controller;

    if (!headers) {
        headers = {};
    }

    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    //TODO mber-id zustand에서 받아오는 걸로 수정 필요
    headers['member-id'] = 'sorrel012';

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: method,
            headers,
            ...(body ? { body: JSON.stringify(body) } : {}),
            ...options,
            signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(
                `서버 오류가 발생하였습니다. ${response.statusText}`,
            );
        }

        // JSON 데이터를 반환
        return (await response.json()) as T;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(
                '응답 시간이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.',
            );
        }

        throw new Error(error.message || '네트워크 오류가 발생했습니다.');
    }
}

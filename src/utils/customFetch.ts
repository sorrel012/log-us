const TIMEOUT = 30 * 1000;

export async function customFetch(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers?: Record<string, string>,
    options?: Omit<RequestInit, 'headers'>,
): Promise<Response> {
    const controller = new AbortController();
    const { signal } = controller;

    if (!headers) {
        headers = {};
    }

    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    //TODO mber-id zustand에서 받아오는 걸로 수정
    headers['member-id'] = 'sorrel012';

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(
            // `https://df5lnwgipj4a5.cloudfront.net/${url}`,
            `http://localhost:8080${url}`,
            {
                method: method,
                headers,
                body: JSON.stringify(body),
                ...options,
                signal,
            },
        );

        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.status > 200) {
            throw new Error(
                '서버 접속 오류가 발생하였습니다. 시스템 상태를 확인해 주세요.',
            );
        }

        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(
                '응답 시간이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.',
            );
        }

        throw error;
    }
}

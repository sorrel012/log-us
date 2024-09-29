import { customFetch } from '@/utils/customFetch';

export interface Series {
    seriesId: number;
    seriesName: string;
    seriesOrder: number;
    imgUrl: string;
}

export async function getSeries() {
    await customFetch('/series.json')
        .then((response) => response)
        .catch((error) => {
            throw new Error('시리즈 조회에 실패하였습니다.', error);
        });
}

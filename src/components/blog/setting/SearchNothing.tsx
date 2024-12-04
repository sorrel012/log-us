import { TbZoom } from 'react-icons/tb';

export default function SearchNothing({ keyword }, { keyword: string }) {
    return (
        <section className="mt-12 flex flex-col items-center">
            <TbZoom className="size-24 rounded-full bg-customLightBlue-200 p-2 text-white" />
            <div className="mt-8 text-lg">
                <em className="mr-2 font-bold text-customLightBlue-200">
                    {keyword}
                </em>
                <span>에 대한 검색 결과가 없습니다.</span>
            </div>
        </section>
    );
}

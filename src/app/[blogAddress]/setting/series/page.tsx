import SeriesList from '@/components/blog/setting/SeriesList';

export default function SeriesManagePage() {
    return (
        <filedset>
            <legend className="mb-8 text-lg font-bold">시리즈 관리</legend>
            <div className="flex justify-between gap-10">
                <section aria-labelledby="series-list" className="w-1/2">
                    <h3 id="series-list" className="mb-8 text-md font-bold">
                        블로그 정보 변경
                    </h3>
                    <article className="max-w-screen-sm rounded bg-customBeige-100">
                        <SeriesList />
                    </article>
                </section>
                <section aria-labelledby="series-list" className="w-1/2">
                    <h3 id="series-list" className="mb-8 text-md font-bold">
                        블로그 정보 변경
                    </h3>
                    <article className="max-w-screen-sm rounded bg-customBeige-100">
                        리스트~
                    </article>
                </section>
            </div>
        </filedset>
    );
}

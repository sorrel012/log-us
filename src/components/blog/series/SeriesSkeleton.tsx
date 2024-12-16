export default function SeriesSkeleton() {
    return (
        <article className="flex aspect-square animate-pulse flex-col items-center justify-center rounded-xl border border-solid border-customLightBlue-100 p-5">
            <div className="mb-4 h-full w-full rounded-md bg-gray-300"></div>
            <div className="h-6 w-2/3 rounded-md bg-gray-300"></div>
        </article>
    );
}

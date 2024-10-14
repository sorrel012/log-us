export default function PostListSkeleton() {
    return (
        <article className="animate-pulse rounded-xl border border-solid border-customLightBlue-100 p-5">
            <header className="flex flex-col gap-3 lg:flex-row">
                <div className="aspect-square h-32 w-32 rounded-md bg-gray-300" />
                <div className="flex w-full flex-col justify-between">
                    <div>
                        <div className="mb-1 flex flex-col justify-between sm:flex-row">
                            <div className="h-6 w-3/5 rounded-md bg-gray-300"></div>
                            <div className="h-6 w-1/5 rounded-md bg-gray-300"></div>
                        </div>
                        <div className="mb-2 h-4 w-full rounded-md bg-gray-300"></div>
                        <div className="mb-2 h-4 w-full rounded-md bg-gray-300"></div>
                        <div className="h-4 w-full rounded-md bg-gray-300"></div>
                    </div>
                    <div className="mt-3 flex gap-1">
                        <div className="h-5 w-12 rounded-md bg-gray-300"></div>
                        <div className="h-5 w-12 rounded-md bg-gray-300"></div>
                        <div className="h-5 w-12 rounded-md bg-gray-300"></div>
                    </div>
                </div>
            </header>
            <footer className="mt-4 flex flex-wrap gap-2">
                <div className="h-6 w-12 rounded-2xl bg-gray-300"></div>
                <div className="h-6 w-12 rounded-2xl bg-gray-300"></div>
                <div className="h-6 w-12 rounded-2xl bg-gray-300"></div>
            </footer>
        </article>
    );
}

import { Post } from '@/components/blog/post/PostCard';
import { IoEllipsisVerticalCircle, IoLockClosedOutline } from 'react-icons/io5';
import { dateFormatter } from '@/utils/commonUtil';
import ViewIcon from '@/components/icons/ViewIcon';
import { Viewer } from '@toast-ui/react-editor';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';

export default function PostDetail({
    postId,
    content,
    status,
    seriesName,
    nickname,
    categoryName,
    reportStatus,
    title,
    tags,
    preId,
    preTitle,
    nextId,
    nextTitle,
    views,
    liked,
    likeCount,
    createdDate,
    imgUrl,
}: Post) {
    return (
        <section className="mx-auto max-w-screen-2xl">
            <header className="border-b border-solid border-customLightBlue-100 pb-6">
                {seriesName && (
                    <div className="text-customLightBlue-200">{seriesName}</div>
                )}
                <div className="mb-2 mt-1.5 inline-flex w-full items-center gap-2">
                    <span className="min-w-0 truncate text-2xl font-bold">
                        {title}
                    </span>
                    <IoEllipsisVerticalCircle className="size-7 flex-shrink-0 text-customDarkBlue-100" />
                </div>

                <div className="mb-3 flex justify-between">
                    <div className="flex gap-2 *:text-customLightBlue-200">
                        <span>{nickname}</span>
                        {categoryName && (
                            <span className="border-l border-solid border-customLightBlue-200 pl-2">
                                {categoryName}
                            </span>
                        )}
                        <span className="border-l border-solid border-customLightBlue-200 pl-2">
                            {dateFormatter(new Date(createdDate))}
                        </span>
                        <span className="border-l border-solid border-customLightBlue-200 pl-2">
                            <ViewIcon views={views} />
                        </span>
                        <span className="border-l border-solid border-customLightBlue-200 pl-2">
                            <IoLockClosedOutline />
                        </span>
                    </div>
                </div>
                <ul className="flex gap-2">
                    {tags?.map((tag) => (
                        <li
                            key={tag}
                            className="inline-flex items-center rounded-xl bg-customBeige-100 px-3 py-1 text-sm text-customBrown-100"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            </header>
            <main className="my-10">
                <div className="content leading-6">
                    <Viewer initialValue={content} />
                </div>
            </main>
            <footer>
                <div className="flex justify-between gap-8">
                    {preId ? (
                        <div className="flex w-1/2 gap-5 rounded-md bg-customBeige-100 px-5 pb-3 pt-4">
                            <GrLinkPrevious className="size-14 rounded-full bg-customBrown-100 p-2 text-white" />
                            <div className="flex min-w-0 flex-1 flex-col justify-around">
                                <div>이전글</div>
                                <div className="overflow-hidden truncate text-ellipsis text-lg font-bold">
                                    {preTitle}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-1/2"></div> // 빈 div로 공간 유지
                    )}
                    {nextId && (
                        <div className="flex w-1/2 gap-5 rounded-md bg-customBeige-100 px-5 pb-3 pt-4 text-right">
                            <div className="flex min-w-0 flex-1 flex-col justify-around">
                                <div>다음글</div>
                                <div className="overflow-hidden truncate text-ellipsis text-lg font-bold">
                                    {nextTitle}
                                </div>
                            </div>
                            <GrLinkNext className="size-14 rounded-full bg-customBrown-100 p-2 text-white" />
                        </div>
                    )}
                </div>
            </footer>
        </section>
    );
}

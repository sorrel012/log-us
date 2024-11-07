import { Post } from '@/components/blog/post/PostCard';
import { IoEllipsisVerticalCircle, IoLockClosedOutline } from 'react-icons/io5';
import { dateFormatter } from '@/utils/commonUtil';
import ViewIcon from '@/components/icons/ViewIcon';
import { Viewer } from '@toast-ui/react-editor';

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
    views,
    liked,
    likeCount,
    createdDate,
    imgUrl,
}: Post) {
    return (
        <section>
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
            <main className="mt-10">
                <Viewer initialValue={content} />
            </main>
            <footer>
                <div>
                    <div>이전글</div>
                    <div>다음글</div>
                </div>
            </footer>
        </section>
    );
}

import { Post } from '@/components/blog/post/PostCard';
import { IoEllipsisVerticalCircle, IoLockClosedOutline } from 'react-icons/io5';
import { dateFormatter, unescapeSpecialChars } from '@/utils/commonUtil';
import ViewIcon from '@/components/icons/ViewIcon';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Viewer } from '@toast-ui/react-editor';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import ConfirmPopup from '@/components/ConfirmPopup';
import LikeIcon from '@/components/icons/LikeIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import { useBlogStore } from '@/store/useBlogStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function PostDetail({
    postId,
    memberId,
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
    liked,
    likeCount,
    views,
    createDate,
    commentCount,
}: Post) {
    const router = useRouter();
    const { blogAddress } = useParams();
    const { isMember, userBlogAuth } = useBlogStore();

    const { loginUser } = useAuthStore();
    const isWriter = memberId === loginUser;

    const [likesCnt, setLikesCnt] = useState(likeCount);
    const [isLiked, setIsLiked] = useState(liked);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleEdit = () => {
        router.push(`/${blogAddress}/newpost/${postId}`);
    };

    const handleDelete = () => {
        setPopupTitle('삭제하시겠습니까?');
        setPopupText('삭제한 글은 복구할 수 없습니다.');
        setShowConfirmPopup(true);
    };

    const handlePopupConfirm = () => {
        if (popupId === 'DELETE_SUCCESS') {
            setShowPopup(false);
            router.push(`/${blogAddress}/posts/series/0&전체보기`);
        } else if (popupId === 'DELETE_FAILED') {
            setShowPopup(false);
        }
    };

    const handleConfirm = async () => {
        setShowPopup(false);
        setPopupText('');
        setIsDropdownOpen(false);
        try {
            const res = await customFetch<any>(`/posts/${postId}`, {
                method: 'DELETE',
                queryKey: ['deletePost', postId],
            });

            if (res.isError) {
                throw new Error(res.error || '게시글을 삭제할 수 없습니다.');
            }

            setPopupTitle('삭제되었습니다.');
            setPopupId('DELETE_SUCCESS');
            setShowPopup(true);
        } catch (e) {
            setPopupTitle('게시글을 삭제할 수 없습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('DELETE_FAILED');
            setShowPopup(true);
        }
    };

    const handleLikeClick = async () => {
        const res = await customFetch(`/like/${postId}`, {
            method: isLiked ? 'DELETE' : 'POST',
            queryKey: ['liked', isLiked],
        });

        if (!res.isError) {
            setLikesCnt((prevState) =>
                isLiked ? prevState - 1 : prevState + 1,
            );
            setIsLiked((prevState) => !prevState);
        }
    };

    return (
        <section className="mx-auto max-w-screen-2xl pb-3">
            <header className="border-b border-solid border-customLightBlue-100 pb-6">
                {seriesName && (
                    <div className="mb-2 text-customLightBlue-200">
                        {seriesName}
                    </div>
                )}
                <div className="mb-2 inline-flex w-full items-center gap-2">
                    <span className="min-w-0 truncate text-2xl font-bold">
                        {unescapeSpecialChars(title)}
                    </span>
                    {(isWriter || (isMember && userBlogAuth === 'OWNER')) && (
                        <div className="relative">
                            <IoEllipsisVerticalCircle
                                className="size-7 flex-shrink-0 cursor-pointer text-customDarkBlue-100"
                                onClick={toggleDropdown}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-1/2 mt-2 w-[80px] translate-x-1/2 transform select-none rounded-lg border border-gray-300 bg-white p-2 shadow-2xl">
                                    {isWriter && (
                                        <div
                                            className="cursor-pointer px-1 py-2 text-center hover:bg-gray-100"
                                            onClick={handleEdit}
                                        >
                                            수정
                                        </div>
                                    )}
                                    <div
                                        className="cursor-pointer px-1 py-2 text-center text-red-600 hover:bg-gray-100"
                                        onClick={handleDelete}
                                    >
                                        삭제
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                            {dateFormatter(new Date(createDate))}
                        </span>
                        <span className="border-l border-solid border-customLightBlue-200 pl-2">
                            <ViewIcon views={views} />
                        </span>
                        {status === 'SECRET' && (
                            <span className="border-l border-solid border-customLightBlue-200 pl-2">
                                <IoLockClosedOutline />
                            </span>
                        )}
                    </div>
                </div>
                <ul className="mt-5 flex gap-2">
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
            <main className="my-12 mb-16">
                <div className="content text-md leading-6">
                    <Viewer initialValue={unescapeSpecialChars(content)} />
                </div>
            </main>
            <footer>
                <div className="flex justify-between gap-8">
                    {preId ? (
                        <Link
                            href={`/${blogAddress}/posts/${preId}`}
                            className="flex w-1/2 gap-5 rounded-md bg-customBeige-100 px-5 pb-3 pt-4"
                        >
                            <GrLinkPrevious className="size-14 rounded-full bg-customBrown-100 p-2 text-white" />
                            <div className="flex min-w-0 flex-1 flex-col justify-around">
                                <div>이전글</div>
                                <div className="overflow-hidden truncate text-ellipsis text-lg font-bold">
                                    {unescapeSpecialChars(preTitle!)}
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="w-1/2"></div>
                    )}
                    {nextId && (
                        <Link
                            href={`/${blogAddress}/posts/${nextId}`}
                            className="flex w-1/2 gap-5 rounded-md bg-customBeige-100 px-5 pb-3 pt-4 text-right"
                        >
                            <div className="flex min-w-0 flex-1 flex-col justify-around">
                                <div>다음글</div>
                                <div className="overflow-hidden truncate text-ellipsis text-lg font-bold">
                                    {unescapeSpecialChars(nextTitle!)}
                                </div>
                            </div>
                            <GrLinkNext className="size-14 rounded-full bg-customBrown-100 p-2 text-white" />
                        </Link>
                    )}
                </div>
                <div className="mt-10 flex justify-between border-b border-solid border-customLightBlue-100 pb-2 text-customLightBlue-200">
                    <LikeIcon
                        likes={likesCnt}
                        isClick={true}
                        liked={isLiked}
                        onClick={handleLikeClick}
                    />
                    <CommentIcon comments={commentCount} />
                </div>
            </footer>
            <AlertPopup
                show={showPopup}
                onConfirm={handlePopupConfirm}
                title={popupTitle}
                text={popupText}
            />
            <ConfirmPopup
                show={showConfirmPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
                onCancel={() => setShowConfirmPopup((prevState) => !prevState)}
            />
        </section>
    );
}
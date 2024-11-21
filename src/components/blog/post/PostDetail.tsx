import { Post } from '@/components/blog/post/PostCard';
import { IoEllipsisVerticalCircle, IoLockClosedOutline } from 'react-icons/io5';
import { dateFormatter, unescapeSpecialChars } from '@/utils/commonUtil';
import ViewIcon from '@/components/icons/ViewIcon';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Viewer } from '@toast-ui/react-editor';
import { customFetch } from '@/utils/customFetch';
import Popup from '@/components/Popup';

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
    views,
    createDate,
}: Post) {
    const router = useRouter();
    const pathname = usePathname();
    const blogAddress = pathname.split('/')[1];

    //TODO zustand에서 받아오기
    const isWriter = memberId === 1;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupType, setPopupType] = useState<'confirm' | 'alert'>('alert');
    const [popupId, setPopupId] = useState('');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleEdit = () => {
        router.push(`/${blogAddress}/newpost/${postId}`);
    };

    const handleDelete = () => {
        setPopupType('confirm');
        setPopupTitle('삭제하시겠습니까?');
        setPopupText('삭제한 글은 복구할 수 없습니다.');
        setShowPopup(true);
        setPopupId('DELETE_FETCH');
    };

    const handlePopupConfirm = async () => {
        if (popupId === 'DELETE_FETCH') {
            setShowPopup(false);
            setPopupText('');
            setIsDropdownOpen(false);
            try {
                const res = await customFetch(`/posts/${postId}`, {
                    method: 'DELETE',
                    queryKey: ['deletePost', postId],
                });

                if (res.isError) {
                    throw new Error(
                        res.error || '게시글을 삭제할 수 없습니다.',
                    );
                }

                setPopupType('alert');
                setPopupTitle('삭제되었습니다.');
                setShowPopup(true);
                setPopupId('DELETE_SUCCESS');
            } catch (e) {
                setPopupType('alert');
                setPopupTitle('게시글을 삭제할 수 없습니다.');
                setPopupText('잠시 후 다시 시도해 주세요.');
                setShowPopup(true);
                setPopupId('DELETE_FAILED');
            }
        } else if (popupId === 'DELETE_SUCCESS') {
            setShowPopup(false);
            router.push(`/${blogAddress}/posts/series/0&전체보기`);
        } else if (popupId === 'DELETE_FAILED') {
            setShowPopup(false);
        }
    };

    const POST_EDIT = [
        { value: 'edit', text: '수정', fnClick: handleEdit },
        { value: 'delete', text: '삭제', fnClick: handleDelete },
    ];

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
                    {isWriter && (
                        <div className="relative">
                            <IoEllipsisVerticalCircle
                                className="size-7 flex-shrink-0 cursor-pointer text-customDarkBlue-100"
                                onClick={toggleDropdown}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-1/2 mt-2 w-[80px] translate-x-1/2 transform select-none rounded-lg border border-gray-300 bg-white p-2 shadow-2xl">
                                    {POST_EDIT.map((type) => (
                                        <div
                                            className={`cursor-pointer px-1 py-2 text-center hover:bg-gray-100 ${type.value === 'delete' && 'text-red-600'}`}
                                            key={type.value}
                                            onClick={type.fnClick}
                                        >
                                            {type.text}
                                        </div>
                                    ))}
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
            </footer>
            <Popup
                show={showPopup}
                onConfirm={handlePopupConfirm}
                title={popupTitle}
                text={popupText}
                type={popupType}
            />
        </section>
    );
}

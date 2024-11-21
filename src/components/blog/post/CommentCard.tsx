import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import { Comment } from '@/components/blog/post/PostCard';
import { dateFormatter } from '@/utils/commonUtil';
import { useState } from 'react';
import { IoEllipsisVerticalCircle } from 'react-icons/io5';
import Popup from '@/components/Popup';
import { customFetch } from '@/utils/customFetch';

export default function CommentCard({
    memberId,
    nickname,
    imgUrl,
    content,
    createDate,
    commentId,
    onEditSuccess,
}: Partial<Comment> & { onEditSuccess: (updatedContent: string) => void }) {
    //TODO 현재 로그인 유저 정보
    const loginUser = 1;
    const isWriter = memberId === loginUser;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editText, setEditText] = useState(content || '');

    const handleEditClick = () => {
        setIsEditMode(true);
        setIsDropdownOpen(false);
    };

    const handleSaveEdit = async () => {
        if (editText.trim() === '') {
            setShowPopup(true);
            setPopupText('댓글 내용을 입력해 주세요.');
            return;
        }

        if (editText.length > 300) {
            setShowPopup(true);
            setPopupText('댓글 내용을 300자 이내로 입력해 주세요.');
            return;
        }

        try {
            const response = await customFetch(`/comments/${commentId}`, {
                method: 'PUT',
                queryKey: ['comment', 'edit', commentId],
                body: { content: editText },
                invalidateCache: true,
            });

            if (!response.isError) {
                setIsEditMode(false);
                onEditSuccess(editText);
            } else {
                throw new Error(response.error || '댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            setShowPopup(true);
            setPopupText(error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditText(content || '');
    };

    const handleDelete = () => {};

    const POST_EDIT = [
        { value: 'edit', text: '수정', fnClick: handleEditClick },
        { value: 'delete', text: '삭제', fnClick: handleDelete },
    ];

    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState('');

    const handleConfirm = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className="flex items-start gap-3 pt-3">
                {imgUrl ? (
                    <div className="relative size-12">
                        <Image
                            src={imgUrl}
                            alt={nickname!}
                            fill
                            className="rounded-full"
                        />
                    </div>
                ) : (
                    <PersonIcon size="size-12 " />
                )}
                <div className="flex flex-col gap-2 text-md">
                    <div className="flex items-center gap-2">
                        <div className="font-bold">{nickname}</div>
                        {isWriter && (
                            <div className="relative">
                                <IoEllipsisVerticalCircle
                                    className="size-5 flex-shrink-0 cursor-pointer text-customDarkBlue-100"
                                    onClick={() =>
                                        setIsDropdownOpen(
                                            (prevState) => !prevState,
                                        )
                                    }
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
                    <div className="text-customLightBlue-200">
                        {dateFormatter(createDate!)}
                    </div>
                </div>
            </div>
            {isEditMode ? (
                <div className="mt-2">
                    <textarea
                        className="w-full resize-none rounded-md border border-solid border-customLightBlue-100 p-2 leading-6 outline-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            className="rounded-md border border-solid border-customLightBlue-200 px-2 py-1 text-customLightBlue-200"
                            onClick={handleCancelEdit}
                        >
                            취소
                        </button>
                        <button
                            className="rounded-md border border-solid border-customLightBlue-200 bg-customLightBlue-200 px-2 py-1 text-white"
                            onClick={handleSaveEdit}
                        >
                            저장
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-2 text-md leading-6">{content}</div>
            )}

            <Popup
                show={showPopup}
                onConfirm={handleConfirm}
                text={popupText}
            />
        </>
    );
}
